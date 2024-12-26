
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import getOrCreateDatabase from '@/models/server/dbsetup';
import getOrCreateStorage from '@/models/server/storageSetup'; 

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    await Promise.all([
        getOrCreateDatabase(),
        getOrCreateStorage()

    ])
    return NextResponse.next();
}

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }