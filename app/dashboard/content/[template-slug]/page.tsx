"use client";
import React, { useState } from "react";
import { use } from "react"; // Use for unwrapping promises
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { chatSession } from "@/utils/AIModel";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

interface PROPS {
    params: Promise<{
        "template-slug": string;
    }>; // params is a Promise in the new Next.js versions
}

function CreateNewContent(props: PROPS) {
    // Unwrap `params` using React's `use()` hook
    const params = use(props.params);

    const selectedTemplate: TEMPLATE | undefined = Templates?.find(
        (item) => item.slug === params["template-slug"]
    );

    const [loading, setLoading] = useState(false);
    const [aiOutput, setAIOutput] = useState<string>("");
    const { user } = useUser();

    const GenerateAIContent = async (formData: any) => {
        setLoading(true);
        const SelectedPrompt = selectedTemplate?.aiPrompt;

        const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

        try {
            const result = await chatSession.sendMessage(FinalAIPrompt);

            const responseText = await result?.response.text();
            console.log("AI Response:", responseText);
            setAIOutput(responseText);

            // Save all data even if some are missing
            await SaveInDb(
                JSON.stringify(formData),
                selectedTemplate?.slug || "unknown-slug",
                responseText || "No AI Response"
            );
        } catch (error) {
            console.error("Error generating AI content:", error);
        }

        setLoading(false);
    };

    const SaveInDb = async (formData: string, slug: string, aiResponse: string) => {
        // Ensure the email is available
        const createdByEmail = user?.primaryEmailAddress?.emailAddress;
        if (!createdByEmail) {
            console.error("User email is unavailable.");
            return; // Prevent saving if email is not available
        }

        const createdAt = moment().toISOString(); // Always set a valid timestamp

        try {
            await db.insert(AIOutput).values({
                formData,
                templateSlug: slug,
                aiResponse,
                createdBy: createdByEmail, // Ensure we store the correct user email
                createdAt:moment().format('DD/MM/YYYY'),
            });
            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error saving to database:", error);
        }
    };

    return (
        <div className="p-10">
            <Link href={"/dashboard"}>
                <Button>
                    <ArrowLeft />
                    Back
                </Button>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
                <FormSection
                    selectedTemplate={selectedTemplate}
                    userFormInput={(v: any) => GenerateAIContent(v)}
                    loading={loading}
                />

                <div className="col-span-2">
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
        </div>
    );
}

export default CreateNewContent;