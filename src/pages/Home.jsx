import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import Ticker from '../components/Ticker';
import GameGrid from '../components/GameGrid';
import DealBanner from '../components/DealBanner';
import TopicCarousels from '../components/TopicCarousels';
import RetroDeals from '../components/RetroDeals';
import Genres from '../components/Genres';
import Newsletter from '../components/Newsletter';

// Página inicial — empilha as seções de marketing na ordem original.
export default function Home() {
  const { hash } = useLocation();

  // Rola até a seção indicada no hash (ex.: /#explore), descontando a navbar
  // fixa. Sem hash, garante que a home abre no topo.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const el = document.getElementById(hash.slice(1));
    if (!el) return undefined;
    const t = setTimeout(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <HeroCarousel />
      <Ticker />
      <GameGrid />
      <DealBanner />
      <TopicCarousels />
      <RetroDeals />
      <Genres />
      <Newsletter />
    </>
  );
}
