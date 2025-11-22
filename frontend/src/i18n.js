// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Pages
          servers: "Servers",
          imageRegistry: "Image Registry",
          repositories: "Repositories",
          apps: "Apps",
          deploys: "Deploys",
          settings: "Settings",

          // Servers Page
          name: "Name",
          ipAddress: "IP Address",
          email: "Email",
          region: "Region",
          port: "Port",
          project: "Project",
        
          // Image Pages
          imageRegistry: "Registry Image",
          version: "Version",
          url: "URL",
          source: "Source",

          // Actions / Buttons
          addLivestock: "Add Livestock",
          submit: "Submit",

          // Apps Page
          domain: "Domain",
          images: "Images",
          image: "Image",

          // Operations
          search: "Search",
          add: "Add",
          create: "Create",
          edit: "Edit",
          archive: "Archive",
          delete: "Delete",

          // Forms
          addServer: "Add Server",
          addImage: "Add Image",
          addRepo: "Add Repository",
          createApp: "Create App",

          emptyTableMessage: "No data added yet",
          noResultMessage: "No results match your search"

        },
      },
      es: {
        translation: {
          // Pages
          servers: "Servidores",
          imageRegistry: "Registro de Imágenes",
          repositories: "Repositorios",
          apps: "Aplicaciones",
          deploys: "Despliegues",
          settings: "Configuración",

          // Servers Page
          name: "Nombre",
          ipAddress: "Dirección IP",
          email: "Correo",
          region: "Región",
          port: "Puerto",
          project: "Proyecto",

          // Image Pages
          imageRegistry: "Registro de Imágenes",
          version: "Versión",
          url: "URL",
          source: "Origen",

          // Actions / Buttons
          addLivestock: "Agregar Ganado",
          submit: "Enviar",

          // Apps Page
          domain: "Dominio",
          images: "Imágenes",
          image: "Imagen",

          // Operations
          search: "Buscar",
          add: "Añadir",
          create: "Crear",
          edit: "Editar",
          archive: "Archivar",
          delete: "Eliminar",

          // Forms
          addServer: "Agregar Servidor",
          addImage: "Agregar Imagen",
          addRepo: "Agregar Repositorio",
          createApp: "Crear Aplicación",

          emptyTableMessage: "Aún no se han agregado datos",
          noResultMessage: "No hay resultados que coincidan con la búsqueda"
        },
      },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  }
);

export default i18n;
