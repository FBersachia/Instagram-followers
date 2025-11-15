export interface Translation {
  // Navigation
  nav: {
    dashboard: string;
    upload: string;
    whitelist: string;
    nonFollowers: string;
    exFollowers: string;
    logout: string;
    logoutConfirm: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    search: string;
    actions: string;
    username: string;
    createdAt: string;
    unfollowedAt: string;
    count: string;
    total: string;
    cancel: string;
    confirm: string;
    delete: string;
    add: string;
    remove: string;
    save: string;
    close: string;
    noData: string;
    filter: string;
    clear: string;
    export: string;
    import: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    stats: {
      whitelist: string;
      nonFollowers: string;
      exFollowers: string;
      totalTracked: string;
    };
    followerCount: {
      title: string;
      current: string;
      record: string;
      history: string;
      evolution: string;
      distribution: string;
      recordedAt: string;
    };
    recentExFollowers: string;
    noRecentExFollowers: string;
    exportStats: string;
    exportCSV: string;
    exportJSON: string;
  };

  // Upload
  upload: {
    title: string;
    step1Title: string;
    howToGetData: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
    instruction5: string;
    instruction6: string;
    copyScriptHint: string;
    jsonFileLabel: string;
    jsonFileHelper: string;
    chooseFile: string;
    orDragDrop: string;
    fileSizeError: string;
    fileTypeError: string;
    dragDrop: string;
    or: string;
    browse: string;
    fileRequirements: string;
    uploadButton: string;
    extractedUsers: string;
    noUsers: string;
    selectAll: string;
    deselectAll: string;
    addToWhitelist: string;
    insertToNonFollowers: string;
    addedToWhitelist: string;
    insertedToNonFollowers: string;
    uploadSuccess: string;
    uploadError: string;
  };

  // Whitelist
  whitelist: {
    title: string;
    description: string;
    addUser: string;
    enterUsername: string;
    addButton: string;
    removeConfirm: string;
    userAdded: string;
    userRemoved: string;
    emptyState: string;
    emptyDescription: string;
  };

  // Non-Followers
  nonFollowers: {
    title: string;
    description: string;
    listTitle: string;
    searchPlaceholder: string;
    loadingText: string;
    moveToExFollowers: string;
    moveConfirm: string;
    moveExplanation: string;
    movedSuccess: string;
    emptyState: string;
    emptyDescription: string;
    noResults: string;
    noResultsDescription: string;
    addedAt: string;
    errorLoading: string;
    errorMoving: string;
    errorNoSelection: string;
  };

  // Ex-Followers
  exFollowers: {
    title: string;
    description: string;
    filterByDate: string;
    from: string;
    to: string;
    clearFilters: string;
    showing: string;
    filtered: string;
    removeConfirm: string;
    userRemoved: string;
    emptyState: string;
    emptyDescription: string;
    noResults: string;
    noResultsDescription: string;
  };

  // Login
  login: {
    title: string;
    subtitle: string;
    username: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    welcome: string;
    loginError: string;
  };

  // Errors
  errors: {
    generic: string;
    networkError: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
  };
}

const es: Translation = {
  nav: {
    dashboard: 'Panel',
    upload: 'Cargar JSON',
    whitelist: 'Lista Blanca',
    nonFollowers: 'No Seguidores',
    exFollowers: 'Ex Seguidores',
    logout: 'Cerrar Sesión',
    logoutConfirm: '¿Estás seguro de que querés cerrar sesión?',
  },

  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    search: 'Buscar',
    actions: 'Acciones',
    username: 'Usuario',
    createdAt: 'Creado',
    unfollowedAt: 'Dejó de seguir',
    count: 'Cantidad',
    total: 'Total',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    add: 'Agregar',
    remove: 'Quitar',
    save: 'Guardar',
    close: 'Cerrar',
    noData: 'Sin datos',
    filter: 'Filtrar',
    clear: 'Limpiar',
    export: 'Exportar',
    import: 'Importar',
  },

  dashboard: {
    title: 'Panel de Control',
    welcome: 'Bienvenido',
    stats: {
      whitelist: 'Lista Blanca',
      nonFollowers: 'No Seguidores',
      exFollowers: 'Ex Seguidores',
      totalTracked: 'Total Rastreados',
    },
    followerCount: {
      title: 'Seguimiento de Seguidores',
      current: 'Cantidad Actual de Seguidores',
      record: 'Registrar',
      history: 'Registros Recientes',
      evolution: 'Evolución de Seguidores',
      distribution: 'Distribución de Usuarios',
      recordedAt: 'Registrado',
    },
    recentExFollowers: 'Ex Seguidores Recientes',
    noRecentExFollowers: 'No hay ex seguidores recientes',
    exportStats: 'Exportar Estadísticas',
    exportCSV: 'Exportar CSV',
    exportJSON: 'Exportar JSON',
  },

  upload: {
    title: 'Cargar JSON de Instagram',
    step1Title: 'Paso 1: Obtené tus Datos de Instagram',
    howToGetData: 'Cómo obtener tus datos:',
    instruction1: 'Andá a Instagram e iniciá sesión en tu cuenta',
    instruction2: 'Abrí la Consola de Desarrollador de tu navegador (F12 o Ctrl+Shift+J)',
    instruction3: 'Escribí clear() en la consola y presioná Enter',
    instruction4: 'Pegá el script de abajo y presioná Enter',
    instruction5: 'Esperá a que el script termine y descargue el archivo JSON',
    instruction6: 'Subí el archivo JSON acá abajo',
    copyScriptHint: 'Hacé clic para copiar el script de extracción de datos de Instagram',
    jsonFileLabel: 'Archivo JSON de Instagram',
    jsonFileHelper: 'Subí el archivo usersNotFollowingBack.json generado por el script',
    chooseFile: 'Elegir Archivo',
    orDragDrop: 'o arrastrá y soltá',
    fileSizeError: 'El archivo debe ser menor a',
    fileTypeError: 'Por favor seleccioná un archivo',
    dragDrop: 'Arrastrá tu archivo JSON acá',
    or: 'o',
    browse: 'Buscá un archivo',
    fileRequirements: 'Solo archivos JSON (máx. 10MB)',
    uploadButton: 'Cargar Archivo',
    extractedUsers: 'Usuarios Extraídos',
    noUsers: 'No se encontraron usuarios. Cargá un archivo JSON primero.',
    selectAll: 'Seleccionar Todos',
    deselectAll: 'Deseleccionar Todos',
    addToWhitelist: 'Agregar a Lista Blanca',
    insertToNonFollowers: 'Insertar a No Seguidores',
    addedToWhitelist: 'usuarios agregados a la lista blanca',
    insertedToNonFollowers: 'usuarios insertados a no seguidores',
    uploadSuccess: 'usuarios extraídos exitosamente',
    uploadError: 'Error al cargar el archivo',
  },

  whitelist: {
    title: 'Lista Blanca',
    description: 'Usuarios excluidos del análisis (ej: celebridades)',
    addUser: 'Agregar Usuario',
    enterUsername: 'Ingresá el nombre de usuario',
    addButton: 'Agregar a Lista Blanca',
    removeConfirm: '¿Estás seguro de que querés eliminar este usuario de la lista blanca?',
    userAdded: 'Usuario agregado a la lista blanca',
    userRemoved: 'Usuario eliminado de la lista blanca',
    emptyState: 'No hay usuarios en la lista blanca',
    emptyDescription: 'Comenzá agregando usuarios que querés excluir del análisis.',
  },

  nonFollowers: {
    title: 'No Seguidores',
    description: 'Usuarios que no te siguen de vuelta (excluye usuarios en lista blanca)',
    listTitle: 'Lista de No Seguidores',
    searchPlaceholder: 'Buscar no seguidores...',
    loadingText: 'Cargando no seguidores...',
    moveToExFollowers: 'Mover a Ex Seguidores',
    moveConfirm: '¿Estás seguro de que querés mover los usuarios seleccionados a ex seguidores?',
    moveExplanation: 'Esta acción los eliminará de la lista de no seguidores y los agregará a la lista de ex seguidores.',
    movedSuccess: 'usuarios movidos a ex seguidores',
    emptyState: 'No hay no seguidores',
    emptyDescription: 'Cargá un archivo JSON e insertá los datos para ver usuarios que no te siguen de vuelta',
    noResults: 'No se encontraron usuarios',
    noResultsDescription: 'Intentá ajustar tu búsqueda',
    addedAt: 'Agregado',
    errorLoading: 'Error al cargar no seguidores',
    errorMoving: 'Error al mover usuario a ex seguidores',
    errorNoSelection: 'No hay usuarios seleccionados',
  },

  exFollowers: {
    title: 'Ex Seguidores',
    description: 'Usuarios que dejaron de seguirte',
    filterByDate: 'Filtrar por Fecha',
    from: 'Desde',
    to: 'Hasta',
    clearFilters: 'Limpiar Filtros',
    showing: 'Mostrando',
    filtered: 'filtrados',
    removeConfirm: '¿Estás seguro de que querés eliminar este usuario?',
    userRemoved: 'Usuario eliminado',
    emptyState: 'No hay ex seguidores',
    emptyDescription: 'Acá aparecerán los usuarios que dejaron de seguirte.',
    noResults: 'No se encontraron resultados',
    noResultsDescription: 'Intentá ajustar los filtros o el término de búsqueda.',
  },

  login: {
    title: 'Instagram Seguidores',
    subtitle: 'Ingresá a tu cuenta',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    loginButton: 'Iniciar Sesión',
    loggingIn: 'Iniciando sesión...',
    welcome: 'Bienvenido',
    loginError: 'Credenciales inválidas',
  },

  errors: {
    generic: 'Ocurrió un error. Por favor, intentá de nuevo.',
    networkError: 'Error de conexión. Verificá tu internet.',
    unauthorized: 'No autorizado. Por favor, iniciá sesión de nuevo.',
    notFound: 'Recurso no encontrado.',
    serverError: 'Error del servidor. Intentá más tarde.',
  },
};

const en: Translation = {
  nav: {
    dashboard: 'Dashboard',
    upload: 'Upload JSON',
    whitelist: 'Whitelist',
    nonFollowers: 'Non-Followers',
    exFollowers: 'Ex-Followers',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
  },

  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    search: 'Search',
    actions: 'Actions',
    username: 'Username',
    createdAt: 'Created',
    unfollowedAt: 'Unfollowed',
    count: 'Count',
    total: 'Total',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    save: 'Save',
    close: 'Close',
    noData: 'No data',
    filter: 'Filter',
    clear: 'Clear',
    export: 'Export',
    import: 'Import',
  },

  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome',
    stats: {
      whitelist: 'Whitelist',
      nonFollowers: 'Non-Followers',
      exFollowers: 'Ex-Followers',
      totalTracked: 'Total Tracked',
    },
    followerCount: {
      title: 'Follower Tracking',
      current: 'Current Follower Count',
      record: 'Record',
      history: 'Recent Records',
      evolution: 'Follower Evolution',
      distribution: 'User Distribution',
      recordedAt: 'Recorded',
    },
    recentExFollowers: 'Recent Ex-Followers',
    noRecentExFollowers: 'No recent ex-followers',
    exportStats: 'Export Statistics',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
  },

  upload: {
    title: 'Upload Instagram JSON',
    step1Title: 'Step 1: Get Your Instagram Data',
    howToGetData: 'How to get your data:',
    instruction1: 'Go to Instagram and log in to your account',
    instruction2: 'Open your browser\'s Developer Console (F12 or Ctrl+Shift+J)',
    instruction3: 'Type clear() in the console and press Enter',
    instruction4: 'Paste the script below and press Enter',
    instruction5: 'Wait for the script to finish and download the JSON file',
    instruction6: 'Upload the JSON file below',
    copyScriptHint: 'Click to copy the Instagram data extraction script',
    jsonFileLabel: 'Instagram JSON File',
    jsonFileHelper: 'Upload the usersNotFollowingBack.json file generated by the script',
    chooseFile: 'Choose File',
    orDragDrop: 'or drag and drop',
    fileSizeError: 'File size must be less than',
    fileTypeError: 'Please select a',
    dragDrop: 'Drag your JSON file here',
    or: 'or',
    browse: 'Browse files',
    fileRequirements: 'JSON files only (max 10MB)',
    uploadButton: 'Upload File',
    extractedUsers: 'Extracted Users',
    noUsers: 'No users found. Upload a JSON file first.',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    addToWhitelist: 'Add to Whitelist',
    insertToNonFollowers: 'Insert to Non-Followers',
    addedToWhitelist: 'users added to whitelist',
    insertedToNonFollowers: 'users inserted to non-followers',
    uploadSuccess: 'users extracted successfully',
    uploadError: 'Error uploading file',
  },

  whitelist: {
    title: 'Whitelist',
    description: 'Users excluded from analysis (e.g., celebrities)',
    addUser: 'Add User',
    enterUsername: 'Enter username',
    addButton: 'Add to Whitelist',
    removeConfirm: 'Are you sure you want to remove this user from the whitelist?',
    userAdded: 'User added to whitelist',
    userRemoved: 'User removed from whitelist',
    emptyState: 'No users in whitelist',
    emptyDescription: 'Start by adding users you want to exclude from analysis.',
  },

  nonFollowers: {
    title: 'Non-Followers',
    description: 'Users who don\'t follow you back (excluding whitelisted users)',
    listTitle: 'Non-Followers List',
    searchPlaceholder: 'Search non-followers...',
    loadingText: 'Loading non-followers...',
    moveToExFollowers: 'Move to Ex-Followers',
    moveConfirm: 'Are you sure you want to move selected users to ex-followers?',
    moveExplanation: 'This action will remove them from the non-followers list and add them to the ex-followers list.',
    movedSuccess: 'users moved to ex-followers',
    emptyState: 'No non-followers',
    emptyDescription: 'Upload a JSON file and insert data to see users who don\'t follow you back',
    noResults: 'No users found',
    noResultsDescription: 'Try adjusting your search query',
    addedAt: 'Added At',
    errorLoading: 'Failed to load non-followers',
    errorMoving: 'Failed to move user to ex-followers',
    errorNoSelection: 'No users selected',
  },

  exFollowers: {
    title: 'Ex-Followers',
    description: 'Users who stopped following you',
    filterByDate: 'Filter by Date',
    from: 'From',
    to: 'To',
    clearFilters: 'Clear Filters',
    showing: 'Showing',
    filtered: 'filtered',
    removeConfirm: 'Are you sure you want to remove this user?',
    userRemoved: 'User removed',
    emptyState: 'No ex-followers',
    emptyDescription: 'Users who stopped following you will appear here.',
    noResults: 'No results found',
    noResultsDescription: 'Try adjusting your filters or search term.',
  },

  login: {
    title: 'Instagram Followers',
    subtitle: 'Sign in to your account',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    loggingIn: 'Signing in...',
    welcome: 'Welcome',
    loginError: 'Invalid credentials',
  },

  errors: {
    generic: 'An error occurred. Please try again.',
    networkError: 'Connection error. Check your internet.',
    unauthorized: 'Unauthorized. Please sign in again.',
    notFound: 'Resource not found.',
    serverError: 'Server error. Try again later.',
  },
};

export const translations = {
  es,
  en,
};
