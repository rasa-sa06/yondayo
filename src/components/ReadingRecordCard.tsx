import Image from "next/image";
import { Card } from "./Card";
import { StarRating } from "./StarRating";
import type { ReadingRecordWithBook } from "../types";

type ReadingRecordCardProps = {
    record: ReadingRecordWithBook;
    onClick?: () => void;
};

export function ReadingRecordCard({ record, onClick }: ReadingRecordCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}ねん ${month}がつ ${day}にち`;
    };

    return (
        <Card hoverable onClick={onClick}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-20 h-[100px] relative">
                    {record.book.imageUrl ? (
                        <Image
                            src={record.book.imageUrl}
                            alt={record.book.title}
                            fill
                            sizes="80px"
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-[32px]">
                            📚
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-brown m-0">
                        {record.book.title}
                    </h3>
                    <p className="text-sm text-gray-600 m-0">{record.book.author}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <StarRating rating={record.rating} readonly size="small" />
                        {/* <span className="text-sm text-brown">よんだ かいすう: {record.readCount}かい</span> */}
                        {/* ↑ 読んだ回数は後で追加するかも */}
                    </div>
                    <p className="text-xs text-gray-500 m-0">
                        {formatDate(record.readDate)}
                    </p>
                    {record.review && (
                        <p className="text-sm text-brown m-0 mt-1 leading-relaxed">
                            {record.review}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
