import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Select } from 'antd';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    availableRoles: string[];
}

export default function UserCreate({ availableRoles }: Props) {
    const { message } = App.useApp();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => message.success('User created successfully'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <Head title="Create User" />
            <PageHeader
                eyebrow="Admin / Users"
                title="Create New User"
                description="Tambahkan akun baru dan tentukan role awalnya."
            />
            <Panel>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={data}
                >
                    <Form.Item
                        label="Name"
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name}
                        required
                    >
                        <Input
                            placeholder="Full Name"
                            size="large"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email}
                        required
                    >
                        <Input
                            placeholder="Email Address"
                            size="large"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </Form.Item>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Form.Item
                            label="Password"
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                            required
                        >
                            <Input.Password
                                placeholder="Password"
                                size="large"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            validateStatus={
                                errors.password_confirmation ? 'error' : ''
                            }
                            help={errors.password_confirmation}
                            required
                        >
                            <Input.Password
                                placeholder="Confirm Password"
                                size="large"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                        </Form.Item>
                    </div>
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
                            Create User
                        </Button>
                    </div>
                </Form>
            </Panel>
        </div>
    );
}

UserCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Users', href: index().url },
        { title: 'Create User', href: '#' },
    ],
});
