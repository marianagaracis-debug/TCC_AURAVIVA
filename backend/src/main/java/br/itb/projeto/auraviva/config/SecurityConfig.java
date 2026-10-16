package br.itb.projeto.auraviva.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // ================= CSRF / CORS =================
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())

            // ================= AUTORIZACAO =================
            .authorizeHttpRequests(auth -> auth
                // ---- Publico (qualquer visitante do site) ----
                .requestMatchers("/usuarios/create").permitAll()      // cadastro de cliente
                .requestMatchers("/usuarios/create-funcionario").permitAll() // cadastro de funcionario (exige codigo)
                .requestMatchers("/login", "/logout").permitAll()

                // Catalogo e blog: livre para consulta (GET)
                .requestMatchers(HttpMethod.GET, "/produtos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/blogs/**").permitAll()

                // Formulario de contato e notificacoes em tempo real
                .requestMatchers(HttpMethod.POST, "/mensagens/enviar").permitAll()
                .requestMatchers("/notificacoes/**").permitAll()

                // Recuperacao de senha
                .requestMatchers("/recuperar-senha/**").permitAll()

                // Newsletter: inscricao publica, leitura so da equipe
                .requestMatchers(HttpMethod.POST, "/newsletter/inscrever").permitAll()
                .requestMatchers("/newsletter/**").hasAnyRole("ADMIN", "FUNCIONARIO")

                // Wishlist e enderecos: so o dono (qualquer usuario autenticado)
                .requestMatchers("/wishlist/**").authenticated()
                .requestMatchers("/enderecos/**").authenticated()

                // Perfil proprio: PUT /me e /me/alterar-senha sao de qualquer usuario logado
                .requestMatchers(HttpMethod.PUT, "/usuarios/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/usuarios/me/alterar-senha").authenticated()

                // Rastreio: somente equipe pode atualizar
                .requestMatchers(HttpMethod.PUT, "/vendas/*/rastreio").hasAnyRole("ADMIN", "FUNCIONARIO")

                // ---- Rotas da equipe (ADMIN ou FUNCIONARIO) ----
                // Cliente (USER) NAO pode cadastrar/editar produtos, blog, pedidos de outros nem ler mensagens
                .requestMatchers(HttpMethod.POST,   "/produtos/**").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.PUT,    "/produtos/**").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.DELETE, "/produtos/**").hasAnyRole("ADMIN", "FUNCIONARIO")

                .requestMatchers(HttpMethod.POST,   "/blogs/**").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.PUT,    "/blogs/**").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.DELETE, "/blogs/**").hasAnyRole("ADMIN", "FUNCIONARIO")

                // Mensagens do "Fale conosco": so a equipe le (o envio e publico, acima)
                .requestMatchers("/mensagens/**").hasAnyRole("ADMIN", "FUNCIONARIO")

                // Gestao de pedidos - excecao do checkout do proprio cliente
                .requestMatchers(HttpMethod.GET, "/vendas/all").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.GET, "/vendas/pedidos/todos").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.PUT, "/vendas/**").hasAnyRole("ADMIN", "FUNCIONARIO")

                // Gestao de usuarios
                .requestMatchers("/usuarios/all").hasAnyRole("ADMIN", "FUNCIONARIO")
                .requestMatchers(HttpMethod.PUT, "/usuarios/*/ativar", "/usuarios/*/inativar").hasAnyRole("ADMIN", "FUNCIONARIO")
                // /me e /me/alterar-senha ja foram permitidos acima; as demais rotas PUT sao de admin
                .requestMatchers(HttpMethod.PUT, "/usuarios/[0-9]*/**").hasRole("ADMIN")

                // ---- Demais rotas exigem apenas autenticacao ----
                // PERFIL (/usuarios/me), MEU carrinho (/vendas POST, /vendas/minhas), etc.
                .anyRequest().authenticated()
            )

            // API: quem nao esta logado recebe 401 (nao um redirecionamento para pagina de login)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

            // ================= LOGIN =================
            .formLogin(form -> form
                .loginProcessingUrl("/login")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "message": "Login realizado com sucesso"
                        }
                    """);
                })
                .failureHandler((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "error": "Usuario ou senha invalidos"
                        }
                    """);
                })
            )

            // ================= LOGOUT =================
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.getWriter().write("""
                        {
                          "message": "Logout realizado com sucesso"
                        }
                    """);
                })
            );

        return http.build();
    }

    // ================= PASSWORD ENCODER (nunca senha em texto puro) =================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

