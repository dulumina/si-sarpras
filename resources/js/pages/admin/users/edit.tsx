import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Select } from 'antd';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    };
    availableRoles: string[];
}

export default function UserEdit({ user, availableRoles }: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        roles: user.roles,
    });

    const onFinish = () => {
        put(update(user.id).url, {
            onSuccess: () => message.success('User updated successfully'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <Head title={`Edit User: ${user.name}`} />
            <PageHeader
                eyebrow="Admin / Users"
                title={user.name}
                description={user.email}
            />
            <Panel
                title="Roles"
                description="Perubahan role berlaku langsung setelah disimpan."
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={data}
                >
                    <Form.Item label="Name">
                        <Input value={user.name} disabled size="large" />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={user.email} disabled size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Roles"
                        validateStatus={errors.roles ? 'error' : ''}
                        help={errors.roles}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select roles"
                            value={data.roles}
                            onChange={(value) => setData('roles', value)}
                            options={availableRoles.map((role) => ({
                                label: role,
                                value: role,
                            }))}
                            size="large"
                        />
                    </Form.Item>
                    <div className="mt-8 flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
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
            </Panel>
        </div>
    );
}

UserEdit.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Users', href: index().url },
        { title: 'Edit User', href: '#' },
    ],
});
