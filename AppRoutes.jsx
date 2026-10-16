import{
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
}from "react-router-dom"

import HomeAuraviva from "../pages/HomeAuraviva/HomeAuraviva"
import Blog from "../pages/Blog/Blog"
import Artigo from "../pages/Artigo/Artigo"
import LogIn from "../pages/LogIn/LogIn"
import Produto from "../pages/Produto/Produto"
import Carrinho from "../pages/Carrinho/Carrinho"
import SementesDeInverno from "../pages/SementesDeInverno/SementesDeInverno"
import SementesDeVerao from "../pages/SementesDeVerao/SementesDeVerao"
import Perfil from "../pages/Perfil/Perfil"
import PerfilUsuario from "../pages/Perfil/PerfilUsuario"
import Intro from "../pages/Intro/Intro"
import AccessibilityWidget from "../components/AccessibilityWidget"

const IntroOnEntry = () => {
    const { pathname } = useLocation()

    return pathname === "/" ? <Intro /> : null
}

const lerSessao = () => {
    try {
        return JSON.parse(localStorage.getItem("auraviva-sessao") || "null")
    } catch {
        return null
    }
}

const RotaPorPerfil = ({ tipoPerfil, children }) => {
    const sessao = lerSessao()
    return sessao?.tipoPerfil === tipoPerfil
        ? children
        : <Navigate to="/auraviva/login" replace />
}

const AppRoutes = () => {
    return(
    <BrowserRouter>
    <IntroOnEntry />
    <AccessibilityWidget />
    <Routes>

    <Route
    path="/"
    element={<HomeAuraviva/>}
    />

    <Route
    path="/auraviva/home"
    element={<HomeAuraviva/>}
    />

    <Route
    path="/auraviva/login"
    element={<LogIn/>}
    />

    <Route
    path="/auraviva/blog"
    element={<Blog/>}
    />

    <Route
    path="/auraviva/blog/:slug"
    element={<Artigo/>}
    />

    <Route
    path="/auraviva/produtos"
    element={<Produto/>}
    />

    <Route
    path="/auraviva/carrinho"
    element={<Carrinho/>}
    />

    <Route
    path="/auraviva/perfil"
    element={<RotaPorPerfil tipoPerfil="cliente"><Perfil/></RotaPorPerfil>}
    />

    <Route
    path="/auraviva/perfil-usuario"
    element={<RotaPorPerfil tipoPerfil="funcionario"><PerfilUsuario/></RotaPorPerfil>}
    />

    <Route
    path="/auraviva/sementes-de-inverno"
    element={<SementesDeInverno/>}
    />

    

    <Route
    path="/auraviva/sementes-de-verao"
    element={<SementesDeVerao/>}
    />



    </Routes>

    </BrowserRouter>
    )
}

export default AppRoutes