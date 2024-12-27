import { answerCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { questionId, answer, authorId } = await request.json();

        // Create a document in the database
        const response = await databases.createDocument(
            db, // Assuming `db` is defined somewhere in your config
            answerCollection,
            ID.unique(),
            {
                content: answer,
                questionId: questionId,
                authorId: authorId
            }
        );

        // Fetch user preferences
        const prefs = await users.getPrefs<UserPrefs>(authorId);

        // Update user preferences (increase reputation by 1)
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation) + 1
        });

        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
export async function DELETE(request: NextRequest) {
    try {
        // Parse the request body to extract the required data
        const { answerId, authorId } = await request.json();

        // Fetch the document to ensure it exists and belongs to the author
        const document = await databases.getDocument(answerCollection, answerId);

        if (!document || document.authorId !== authorId) {
            return NextResponse.json(
                { error: "Answer not found or unauthorized" },
                { status: 404 }
            );
        }

        // Delete the document
        await databases.deleteDocument(answerCollection, answerId);

        // Fetch user preferences
        const prefs = await users.getPrefs<UserPrefs>(authorId);

        // Update user preferences (decrease reputation by 1)
        await users.updatePrefs(authorId, {
            reputation: Math.max(0, Number(prefs.reputation) - 1) // Ensure reputation doesn't go below 0
        });

        // Return a success response
        return NextResponse.json(
            { success: true, message: "Answer deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
