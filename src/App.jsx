import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GameDetails from './components/GameDetails';
import CartDrawer from './components/CartDrawer';
import { GameDetailsProvider } from './context/GameDetailsContext';
import { CartProvider } from './context/CartContext';
import { LibraryProvider } from './context/LibraryContext';
import RotaProtegida from './components/RotaProtegida';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Conta from './pages/Conta';
import Admin from './pages/Admin';

export default function App() {
  return (
    <GameDetailsProvider>
      <CartProvider>
        <LibraryProvider>
        <div className="relative min-h-screen bg-ink-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              {/* Conta livre: o convidado vê a biblioteca local; pedidos e
                  sincronização pedem login dentro da própria página. */}
              <Route path="/conta" element={<Conta />} />
              <Route
                path="/admin"
                element={
                  <RotaProtegida somenteAdmin>
                    <Admin />
                  </RotaProtegida>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        {/* Aba de detalhes em overlay — sobe ao clicar em qualquer card de jogo */}
        <GameDetails />
        {/* Carrinho — gaveta lateral */}
        <CartDrawer />
        </LibraryProvider>
      </CartProvider>
    </GameDetailsProvider>
  );
}
