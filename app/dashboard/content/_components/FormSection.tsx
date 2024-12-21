"use client";
import React, { useState } from "react";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface PROPS {
    selectedTemplate?: TEMPLATE;
    userFormInput: any;
    loading: boolean;
}

function FormSection({ selectedTemplate, userFormInput, loading }: PROPS) {

    const [formData, setFormData] = useState<any>();

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        userFormInput(formData);
    };

    return (
        <div className="p-5 shadow-lg border-2 border-teal-600 bg-teal-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-10  hover:border-teal-400 hover:shadow-[0_0_15px_4px_#10b981]">
            {/* @ts-ignore */}
            <Image src={selectedTemplate?.icon || "/default-icon.png"} alt="icon" width={80} height={80} className="rounded-full border-4 border-teal-600 p-2" />
            <h2 className="font-bold text-2xl mb-2">{selectedTemplate?.name}</h2>
            <p className="text-gray-500 text-sm">{selectedTemplate?.desc}</p>

            <form className="mt-6" onSubmit={onSubmit}>
                {selectedTemplate?.form?.map((item, index) => (
                    <div key={item.name || index} className="my-2 flex flex-col gap-3 mb-7">
                        <label className="font-bold">{item.label}</label>
                        {item.field == "input" ?
                            <Input name={item.name} required={item?.required}
                                onChange={handleInputChange}
                                className="border-2 border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 p-4 rounded-lg"
                            />
                            : item.field == "textarea" ?
                                <Textarea name={item.name} required={item?.required}
                                    onChange={handleInputChange}
                                    className="border-2 border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 p-4 rounded-lg"
                                />
                                : null
                        }
                    </div>
                ))}
                <Button type="submit" className="w-full py-6 bg-teal-600 text-white hover:bg-teal-700 focus:outline-none rounded-lg shadow-lg transition-all ease-in-out"
                    disabled={loading}>
                    {loading && <Loader2Icon className="animate-spin mr-2" />}
                    Generate Content
                </Button>
            </form>
        </div>
    );
}

export default FormSection;
