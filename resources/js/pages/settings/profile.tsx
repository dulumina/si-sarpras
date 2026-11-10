import { UserOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Typography, Alert, Space } from 'antd';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

const { Title, Text } = Typography;

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const { message } = App.useApp();
    
    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const onFinish = () => {
        patch(ProfileController.update().url, {
            preserveScroll: true,
            onSuccess: () => message.success('Profile updated successfully'),
        });
    };

    return (
        <>
            <Head title="Profile settings" />

            <div className="space-y-8">
                <div>
                    <Title level={4}>Profile Information</Title>
                    <Text type="secondary">Update your name and email address</Text>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={data}
                    requiredMark="optional"
                >
                    <Form.Item
                        label="Name"
                        required
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Full name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        required
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            type="email"
                            placeholder="Email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            size="large"
                        />
                    </Form.Item>

                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div className="mb-6">
                            <Alert
                                message={
                                    <Space direction="vertical" size={0}>
                                        <Text>Your email address is unverified.</Text>
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </Space>
                                }
                                type="warning"
                                showIcon
                            />

                            {status === 'verification-link-sent' && (
                                <Alert
                                    message="A new verification link has been sent to your email address."
                                    type="success"
                                    showIcon
                                    className="mt-2"
                                />
                            )}
                        </div>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                            icon={<SaveOutlined />}
                            size="large"
                        >
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>

                <div className="pt-8 border-t border-gray-100">
                    <DeleteUser />
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit().url,
        },
    ],
};
