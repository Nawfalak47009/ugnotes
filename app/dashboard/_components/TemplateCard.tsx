import React from 'react';
import { TEMPLATE } from './TemplateListSection';
import Image from 'next/image';
import Link from 'next/link';

function TemplateCard(item: TEMPLATE) {
  return (
    <Link href={'/dashboard/content/' + item?.slug}>
      <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:scale-105  transition-all ease-in-out transform hover:translate-y-2 hover:bg-teal-50 hover:shadow-[0_0_10px_5px_#10b981] flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={item.icon}
            alt="icon"
            width={60}
            height={60}
            className="rounded-full border-2 border-teal-500 p-2 transition-all duration-200 transform hover:scale-110"
          />
        </div>
        <h2 className="font-semibold text-xl text-gray-800 text-center hover:text-teal-600 transition-all duration-200">
          {item.name}
        </h2>
        <p className="text-gray-500 text-sm line-clamp-3 text-center mt-2">{item.desc}</p>
      </div>
    </Link>
  );
}

export default TemplateCard;
