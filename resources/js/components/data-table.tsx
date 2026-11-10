import { SearchOutlined } from '@ant-design/icons';
import { Input, Pagination, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useRef, useState } from 'react';

const { Text } = Typography;

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface DataTableProps<T extends Record<string, any>> {
    columns: ColumnsType<T>;
    data: T[];
    rowKey: string | ((record: T) => string);
    loading?: boolean;
    clientSide?: boolean;
    total?: number;
    page?: number;
    perPage?: number;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    search?: string;
    onSearchChange?: (search: string) => void;
    searchPlaceholder?: string;
    title?: React.ReactNode;
    extra?: React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    rowKey,
    loading = false,
    clientSide = false,
    total: totalProp,
    page: pageProp,
    perPage: perPageProp,
    onPageChange,
    onPerPageChange,
    search: searchProp = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    title,
    extra,
}: DataTableProps<T>) {
    const [localPage, setLocalPage] = useState(1);
    const [localPerPage, setLocalPerPage] = useState(10);
    const [localSearch, setLocalSearch] = useState('');
    const [searchValue, setSearchValue] = useState(
        clientSide ? '' : searchProp,
    );
    const [prevSearchProp, setPrevSearchProp] = useState(searchProp);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    // Adjust state during render when the parent changes the search prop.
    if (!clientSide && searchProp !== prevSearchProp) {
        setPrevSearchProp(searchProp);
        setSearchValue(searchProp);
    }

    const filteredData = useMemo(() => {
        if (!clientSide || !localSearch) {
            return data;
        }

        const q = localSearch.toLowerCase();

        return data.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(q),
            ),
        );
    }, [data, localSearch, clientSide]);

    const total = clientSide ? filteredData.length : (totalProp ?? 0);
    const page = clientSide ? localPage : (pageProp ?? 1);
    const perPage = clientSide ? localPerPage : (perPageProp ?? 10);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (clientSide) {
                setLocalSearch(value);
                setLocalPage(1);
            } else {
                onSearchChange?.(value);
            }
        }, 400);
    };

    const handlePageChange = (p: number) => {
        if (clientSide) {
            setLocalPage(p);
        } else {
            onPageChange?.(p);
        }
    };

    const handlePerPageChange = (pp: number) => {
        if (clientSide) {
            setLocalPerPage(pp);
            setLocalPage(1);
        } else {
            onPerPageChange?.(pp);
        }
    };

    const startItem = total > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, total);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    {title && (
                        <Text strong className="text-base text-foreground">
                            {title}
                        </Text>
                    )}
                    {total > 0 && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {total.toLocaleString()} items
                        </span>
                    )}
                    {extra}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        prefix={
                            <SearchOutlined className="text-muted-foreground" />
                        }
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full sm:w-64"
                        allowClear
                    />
                    <Select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="w-28"
                        options={PER_PAGE_OPTIONS.map((n) => ({
                            value: n,
                            label: `${n}/page`,
                        }))}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={clientSide ? filteredData : data}
                rowKey={rowKey}
                loading={loading}
                size="middle"
                pagination={
                    clientSide
                        ? {
                              pageSize: perPage,
                              current: page,
                              total,
                              showSizeChanger: false,
                              onChange: handlePageChange,
                          }
                        : false
                }
            />

            {!clientSide && total > 0 && (
                <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Text type="secondary" className="text-sm">
                        Showing {startItem}-{endItem} of {total} items
                    </Text>
                    <Pagination
                        current={page}
                        pageSize={perPage}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
}
