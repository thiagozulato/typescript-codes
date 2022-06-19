// Authenticator
interface IUserStorageProvider<TEntity> {
    getUser(): TEntity | null;
    setUser(user: TEntity): void;
    clear(): void;
}

type User = {
    id: number;
    name: string;
    email: string;
}

type UserResquest = {
    email: string;
    password: string;
}

type ChangeCallback<SResponse> = (user: SResponse | null) => void;

interface IAuthenticatorService<SRequest, SResponse> {
    signIn(request: SRequest): Promise<SResponse>
}

interface IAuthenticator<SRequest, SResponse> {
    onAuthChange(cb: ChangeCallback<SResponse>): void
    signIn(request: SRequest): Promise<SResponse>;
    signOut(): void;
    getCurrentUser(): SResponse | null;
}

class Authenticator<SRequest, SResponse> implements IAuthenticator<SRequest, SResponse> {
    private _cb: ChangeCallback<SResponse> | null = null
    private _user: SResponse | null = null
    private _storageProvider: IUserStorageProvider<SResponse>
    private _authenticatorService: IAuthenticatorService<SRequest, SResponse>

    constructor(storageProvider: IUserStorageProvider<SResponse>,
               authenticatorService: IAuthenticatorService<SRequest, SResponse>) {
        this._storageProvider = storageProvider;
        this._authenticatorService = authenticatorService;

        this._user = this._storageProvider.getUser();
    }        

    private triggerUpdate() {
        this._cb && this._cb(this._user);
    }

    public onAuthChange(cb: ChangeCallback<SResponse>) {
        this._cb = cb;
    }

    public async signIn(request: SRequest): Promise<SResponse> {
        try {
            this._user = await this._authenticatorService.signIn(request);

            this._storageProvider.setUser(this._user);
            this.triggerUpdate();

            return this._user;
        } catch (error) {
            throw error;
        }
    }

    public signOut() {
        this._user = null;
        this._storageProvider.clear();
        this.triggerUpdate();
    }

    public getCurrentUser() {
        return this._user;
    }
}

class AuthenticatorService implements IAuthenticatorService<UserResquest, User> {
    signIn(request: UserResquest): Promise<User> {
        return new Promise((resolve, reject) => {
            if (request.email === 'thiagozulato@gmail.com' &&
                request.password === '123456') {
                resolve({
                    id: 1,
                    name: "Thiago Zulato",
                    email: request.email
                })
            } else  {
                reject(new Error("User not found"))
            }
        })
    }
}

class LocalStorageUserProvider implements IUserStorageProvider<User> {
    private USER_CACHE_KEY = "user-login";

    public setUser(user: User) {
        window.localStorage.setItem(this.USER_CACHE_KEY, JSON.stringify(user));
    }

    public getUser(): User | null {
        const user = window.localStorage.getItem(this.USER_CACHE_KEY);

        if (!user) return null;

        return JSON.parse(user) as User;
    }

    public clear() {
        window.localStorage.removeItem(this.USER_CACHE_KEY);
    }
}

const auth = new Authenticator<UserResquest, User>(
                new LocalStorageUserProvider(),
                new AuthenticatorService());

auth.onAuthChange((user) => {
    if (user) {
        console.log(`logged as: ${user}`)
    } else {
        console.log('not logged')
    }
})

console.log(auth.getCurrentUser());

auth.signIn({ 
    email: 'thiagozulato@gmail.com',
    password: '123456'
}).catch(err => {
    console.log(err);
});

auth.signOut();

console.log(auth.getCurrentUser());
