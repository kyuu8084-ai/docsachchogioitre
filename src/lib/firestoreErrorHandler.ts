import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Detect "offline" error which usually means Database not created in console
  const isOfflineError = errorMessage.includes('offline') || errorMessage.includes('failed-precondition');
  
  const errInfo: FirestoreErrorInfo = {
    error: isOfflineError 
      ? `KHÔNG THỂ KẾT NỐI FIREBASE: Lỗi này thường do bạn chưa nhấn nút "Create Database" trong mục Firestore Database trên Firebase Console. Vui lòng kiểm tra lại thiết lập tại console.firebase.google.com. (${errorMessage})`
      : errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo, null, 2));
  
  // If it's a specific "not created" error, we might want to alert the user in a more visible way
  if (isOfflineError) {
    window.dispatchEvent(new CustomEvent('firebase-connection-failed', { detail: errInfo }));
  }
  
  throw new Error(JSON.stringify(errInfo));
}
