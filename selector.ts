type User = {
  name: string;
  email: string;
}

type Github = {
  userName: string;
  url: string;  
}

// Store
type Store = {
  user: User;
  github: Github;
}

const store: Store = {
  user: {
    name: "User Name",
    email: "user@gmail.com"
  },
  github: {
    userName: "user_name_login",
    url: "https://github.com/user_name_Login"
  }
}

// Selector
function selector<S, R>(store: S, get: (data: S) => R) {
  return get(store);
}

// Use
const user = selector<Store, User>(store, data => data.user);
const github = selector<Store, Github>(store, data => data.github);

console.log("User --> ", user);
console.log("Github --> ", github);