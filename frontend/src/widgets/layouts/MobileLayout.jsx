import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import Footer from './components/Footer';
import SidebarLayout from './SidebarLayout';
import FormLayout from './FormLayout';
import { routes } from '../../routes';
import BottombarLayout from './BottombarLayout';
import Shell from '../components/shell/Shell';

export default function MobileLayout() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  // Definir los elementos del sidebar usando traducciones y rutas dinámicas
  const sidebarElements = [
    { name: t('servers'), url: routes[lang].servers, icon: '/deploy/servers.svg' },
    { name: t('imageRegistry'), url: routes[lang].images, icon: '/deploy/docker.svg' },
    { name: t('repositories'), url: routes[lang].repositories, icon: '/deploy/github.svg' },
    { name: t('apps'), url: routes[lang].apps, icon: '/deploy/servers.svg' },
    { name: t('settings'), url: routes[lang].settings, icon: '/settings.png' },
  ];

  return (
    <>
      <BottombarLayout elements={sidebarElements} className=""/>
      <Shell/>
      
      <div className='page-container'>
        <header>
          <Header />
        </header>
        
        <main className='full-w flex column'>
          <Outlet />
        </main>

        <footer>
          <Footer />
        </footer>

        <FormLayout />
      </div>
    </>
  );
}
