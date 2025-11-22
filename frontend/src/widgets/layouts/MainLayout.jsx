import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import Footer from './components/Footer';
import SidebarLayout from './SidebarLayout';
import FormLayout from './FormLayout';
import { routes } from '../../routes';
import Shell from '../components/shell/Shell';

export default function Layout() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  // Definir los elementos del sidebar usando traducciones y rutas dinámicas
  const sidebarElements = [
    { name: t('servers'), url: routes[lang].servers, icon: '/deploy/servers.svg' },
    { name: t('image_registry'), url: routes[lang].images, icon: '/deploy/docker.svg' },
    { name: t('repositories'), url: routes[lang].repositories, icon: '/deploy/github.svg' },
    { name: t('apps'), url: routes[lang].apps, icon: '/deploy/servers.svg' },
    { name: t('settings'), url: routes[lang].settings, icon: '/settings.png' },
  ];

  return (
    <>
      <SidebarLayout
        elements={sidebarElements}
        className=""
      />

      <div className='page-container'>
        <div className='page-content full-view'>
          <header>
            <Header />
          </header>
          
          <main className='full-w flex column'>
            <Outlet />
          </main>
        </div>

        <Shell/>

        {/* <footer>
          <Footer />
        </footer> */}
      </div>
        <FormLayout />

    </>
  );
}
