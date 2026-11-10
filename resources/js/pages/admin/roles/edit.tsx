import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Switch } from 'antd';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Admin/RoleController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    role: {
        id: number;
        name: string;
        permissions: string[];
    };
    availablePermissions: string[];
}

export default function RoleEdit({ role, availablePermissions }: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions,
    });

    const groupedPermissions = availablePermissions.reduce(
        (acc, permission) => {
            let group = 'General';

            if (permission.includes('.')) {
                group = permission.split('.')[0];
            } else if (permission.includes(' ')) {
                const parts = permission.split(' ');
                group = parts[parts.length - 1];
            }

            const groupName = group.charAt(0).toUpperCase() + group.slice(1);

            if (!acc[groupName]) {
                acc[groupName] = [];
            }

            acc[groupName].push(permission);

            return acc;
        },
        {} as Record<string, string[]>,
    );

    const onFinish = () => {
        put(update(role.id).url, {
            onSuccess: () => message.success('Role updated successfully'),
        });
    };

    const togglePermission = (permission: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [
                ...data.permissions,
                permission,
            ] as never[]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permission) as never[],
            );
        }
    };

    const toggleGroup = (groupPerms: string[], checked: boolean) => {
        if (checked) {
            const newPermissions = Array.from(
                new Set([...data.permissions, ...groupPerms]),
            );
            setData('permissions', newPermissions as never[]);
        } else {
            const newPermissions = data.permissions.filter(
                (p) => !groupPerms.includes(p),
            );
            setData('permissions', newPermissions as never[]);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title={`Edit Role: ${role.name}`} />
            <PageHeader
                eyebrow="Admin / Roles"
                title={role.name}
                description="Ubah nama role dan permission yang melekat padanya."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <div className="space-y-6">
                    <Panel title="Role details">
                        <Form.Item
                            label="Role Name"
                            required
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            className="!mb-0"
                        >
                            <Input
                                placeholder="Enter role name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                size="large"
                                disabled={role.name === 'super-admin'}
                            />
                        </Form.Item>
                    </Panel>

                    <Panel
                        title="Permissions"
                        description={`${data.permissions.length} of ${availablePermissions.length} selected`}
                        actions={
                            <div className="flex items-center gap-2">
                                <Button
                                    size="small"
                                    onClick={() =>
                                        setData(
                                            'permissions',
                                            availablePermissions as never[],
                                        )
                                    }
                                >
                                    Select all
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        setData('permissions', [] as never[])
                                    }
                                >
                                    Clear
                                </Button>
                            </div>
                        }
                    >
                        <div className="space-y-5">
                            {Object.entries(groupedPermissions).map(
                                ([group, perms]) => {
                                    const allChecked = perms.every((p) =>
                                        data.permissions.includes(p as never),
                                    );

                                    return (
                                        <div
                                            key={group}
                                            className="rounded-xl border border-border bg-muted/40 p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h3 className="m-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                    {group}
                                                </h3>
                                                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    Select group
                                                    <Switch
                                                        size="small"
                                                        checked={allChecked}
                                                        onChange={(checked) =>
                                                            toggleGroup(
                                                                perms,
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                                                {perms.map((p) => {
                                                    const checked =
                                                        data.permissions.includes(
                                                            p as never,
                                                        );

                                                    return (
                                                        <div
                                                            key={p}
                                                            className={`flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors ${
                                                                checked
                                                                    ? 'border-primary/40'
                                                                    : 'border-border'
                                                            }`}
                                                        >
                                                            <span className="truncate text-sm text-foreground">
                                                                {p}
                                                            </span>
                                                            <Switch
                                                                size="small"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={(
                                                                    value,
                                                                ) =>
                                                                    togglePermission(
                                                                        p,
                                                                        value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                        {errors.permissions && (
                            <div className="mt-2 text-sm text-destructive">
                                {errors.permissions}
                            </div>
                        )}
                    </Panel>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button size="large" href={index().url}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        size="large"
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}

RoleEdit.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Roles', href: index().url },
        { title: 'Edit', href: '#' },
    ],
});
