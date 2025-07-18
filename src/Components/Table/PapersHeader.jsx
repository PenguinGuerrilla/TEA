import { flexRender, Header } from "@tanstack/react-table";
import { TableHead } from "../ui/table";

export function PapersHeader({
    header,
}){
    const resizeHandler = header.getResizeHandler();
    return(
        <TableHead
        key={header.column.id}
        colSpan={header.colSpan}
        className={`bg-gray-100 dark:bg-gray-800 ${header.column.getCanResize() ? 'cursor-col-resize' : ''}`}
        style={{ width: header.getSize(),
            flex: `0 0 ${header.column.getSize()}px`,
         }}
        >
            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                )}
            </span>
            <div
                onDoubleClick={()=> header.column.resetSize()}
                onMouseDown={resizeHandler}
                onTouchStart={resizeHandler}
                className={}
            ></div>
        </TableHead>
    );
};