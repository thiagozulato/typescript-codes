type ApiMetadata = {
  id: string;
  description: string;
}

type ApiFactory<T = {}> = {
  (): T;
}

type ApiService<T = {}> = {
  api: ApiMetadata;
  factory: ApiFactory<T>;
}

// Service Collection
interface IServiceCollection {
  registry: <T>(service: ApiService<T>) => void;
  get: <T>(metadata: ApiMetadata) => T | undefined;
}

class ServiceCollection implements IServiceCollection {
  private _apis = new Map<ApiMetadata, ApiFactory<unknown>>();
  private _cache = new Map<ApiMetadata, unknown>();
  
  registry<T>(service: ApiService<T>) {
    const isServiceExists = this._apis.get(service.api);

    if (isServiceExists) {
      return;
    }

    const { api, factory } = service;
    this._apis.set(api, factory);
  }

  get<T>(metadata: ApiMetadata): T | undefined {
    const api = this._cache.get(metadata);

    if (api) {
      return api as T;
    }

    const factory = this._apis.get(metadata);

    if (!factory) {
      throw new Error(`No service registered for ${metadata.id}`);
    }

    const apiServiceInstance = factory();

    this._cache.set(metadata, apiServiceInstance);
    return apiServiceInstance as T;
  }  
}

// User Service
interface IUserService {
  getUser: () => void;
}

class UserService implements IUserService {
  getUser() {
    console.log("User data");
  }
}

const userService: ApiService<IUserService> = {
  api: {
    id: "api.user",
    description: "API that holds user information"
  },
  factory: () => new UserService()
}

// Service Collection instance
const serviceCollection = new ServiceCollection();

serviceCollection.registry(userService);

// Get User Service
const userApi = serviceCollection.get<IUserService>(userService.api);

userApi?.getUser();