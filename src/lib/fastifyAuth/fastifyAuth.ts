import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { User } from "../models/User";

export type SSRContext = GetServerSidePropsContext<ParsedUrlQuery, PreviewData>

export interface OAuthProvider {
    id: string
    name: string
    loginPath: string
    callbackUri: string
}

export interface FastifySession {
    user: User
}