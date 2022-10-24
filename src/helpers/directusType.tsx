export type Articles = {
    id: string;
    title: string;
}

export type DirectusUsers = {
    email: string;
    password: string;
    id: string;
    signature: string;
    role: string;
}

export type MyCollections = {
    articles: Articles;
    directus_users: DirectusUsers;
};