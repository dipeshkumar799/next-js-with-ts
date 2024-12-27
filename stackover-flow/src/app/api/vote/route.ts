import { databases } from "@/models/server/config";
import { NextResponse } from "next/server";
export async function POST(request:NextResponse){
//grabe some data  
 const  {voteById,voteStatus,type,typeId}  = await request.json();

 const response = await databases.listDocuments()

    try {
        
    } catch (error: any) {
            console.error(error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
}