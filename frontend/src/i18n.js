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
          server: "Server",

          imageRegistry: "Image Registry",
          images: "Images",
          image: "Image",

          repositories: "Repositories",
          repository: "Repository",

          apps: "Apps",
          app: "App",

          deploys: "Deploys",
          settings: "Settings",

          // Servers Page
          name: "Name",
          ipAddress: "IP Address",
          email: "Email",
          region: "Region",
          port: "Port",
          project: "Project",
          projectId: "Project ID",

          // Image Pages
          version: "Version",
          url: "URL",
          source: "Source",
          branch: "Branch",

          // Actions / Buttons
          addLivestock: "Add Livestock",
          submit: "Submit",

          // Apps Page
          domain: "Domain",

          // Operations
          search: "Search",
          add: "Add",
          create: "Create",
          edit: "Edit",
          archive: "Archive",
          delete: "Delete",
          update: "Update",
          deploy: "Deploy",
          build: "Build",
          buildImage: "Build Image",
          terminal: "Terminal",
          selectServerMessage: "Select a server to connect",

          // Forms
          addServer: "Add Server",
          addImage: "Add Image",
          addRepo: "Add Repository",
          createApp: "Create App",

          // Table messages
          emptyTableMessage: "No data added yet",
          noResultMessage: "No results match your search",
        },
      },

      es: {
        translation: {
          // Pages
          servers: "Servidores",
          server: "Servidor",

          imageRegistry: "Registro de Imágenes",
          images: "Imágenes",
          image: "Imagen",

          repositories: "Repositorios",
          repository: "Repositorio",

          apps: "Aplicaciones",
          app: "Aplicación",

          deploys: "Despliegues",
          settings: "Configuración",

          // Servers Page
          name: "Nombre",
          ipAddress: "Dirección IP",
          email: "Correo",
          region: "Región",
          port: "Puerto",
          project: "Proyecto",
          projectId: "ID del Proyecto",

          // Image Pages
          version: "Versión",
          url: "URL",
          source: "Origen",
          branch: "Rama",

          // Actions / Buttons
          addLivestock: "Agregar Ganado",
          submit: "Enviar",

          // Apps Page
          domain: "Dominio",

          // Operations
          search: "Buscar",
          add: "Añadir",
          create: "Crear",
          edit: "Editar",
          archive: "Archivar",
          delete: "Eliminar",
          update: "Actualizar",
          deploy: "Desplegar",
          build: "Construir",
          buildImage: "Construir Imagen",
          terminal: "Terminal",
          selectServerMessage: "Selecciona un server para conectarse",

          // Forms
          addServer: "Agregar Servidor",
          addImage: "Agregar Imagen",
          addRepo: "Agregar Repositorio",
          createApp: "Crear Aplicación",

          // Table messages
          emptyTableMessage: "Aún no se han agregado datos",
          noResultMessage: "No hay resultados que coincidan con la búsqueda",
        },
      },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });

export default i18n;
