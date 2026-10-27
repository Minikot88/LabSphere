/** Provider boundaries; no external identity provider or scanner is enabled locally. */
export interface IdentityProvider {authenticate(code:string,redirectUri:string):Promise<{subject:string;email:string;emailVerified:boolean}>}
export interface PrivateFileStorage {put(key:string,bytes:Buffer):Promise<void>;get(key:string):Promise<Buffer>}
export interface MalwareScanner {scan(bytes:Buffer,mimeType:string):Promise<'CLEAN'|'INFECTED'|'NOT_SCANNED'>}
export class NoScanner implements MalwareScanner {async scan(_bytes:Buffer,_mimeType:string){return 'NOT_SCANNED' as const;}}
