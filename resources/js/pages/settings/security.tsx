import { LockOutlined, SafetyOutlined, SaveOutlined } from '@ant-design/icons';
import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Typography, Alert, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

const { Title, Text } = Typography;

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { message } = App.useApp();
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors: twoFactorErrors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    const onFinish = () => {
        put(SecurityController.update().url, {
            preserveScroll: true,
            onSuccess: () => {
                message.success('Password updated successfully');
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Security settings" />

            <div className="space-y-12">
                <section>
                    <div className="mb-6">
                        <Title level={4}>Update Password</Title>
                        <Text type="secondary">Ensure your account is using a long, random password to stay secure</Text>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark="optional"
                    >
                        <Form.Item
                            label="Current Password"
                            required
                            validateStatus={errors.current_password ? 'error' : ''}
                            help={errors.current_password}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Current password"
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            required
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="New password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            required
                            validateStatus={errors.password_confirmation ? 'error' : ''}
                            help={errors.password_confirmation}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                icon={<SaveOutlined />}
                                size="large"
                            >
                                Update Password
                            </Button>
                        </Form.Item>
                    </Form>
                </section>

                {canManageTwoFactor && (
                    <section className="pt-8 border-t border-gray-100">
                        <div className="mb-6">
                            <Title level={4}>Two-Factor Authentication</Title>
                            <Text type="secondary">Add additional security to your account using two-factor authentication</Text>
                        </div>

                        {twoFactorEnabled ? (
                            <Space direction="vertical" size="large" className="w-full">
                                <Alert
                                    message="Two-factor authentication is enabled."
                                    description="You will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone."
                                    type="success"
                                    showIcon
                                    icon={<SafetyOutlined />}
                                />

                                <div className="flex flex-wrap gap-4">
                                    <Form action={disable().url} method="post">
                                        <Button
                                            danger
                                            htmlType="submit"
                                            size="large"
                                        >
                                            Disable 2FA
                                        </Button>
                                    </Form>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={twoFactorErrors}
                                    />
                                </div>
                            </Space>
                        ) : (
                            <Space direction="vertical" size="large" className="w-full">
                                <Alert
                                    message="Two-factor authentication is not enabled."
                                    description="When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone."
                                    type="info"
                                    showIcon
                                />

                                <div>
                                    {hasSetupData ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<SafetyOutlined />}
                                            onClick={() => setShowSetupModal(true)}
                                        >
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form action={enable().url} method="post" onFinish={() => setShowSetupModal(true)}>
                                            <Button
                                                type="primary"
                                                size="large"
                                                htmlType="submit"
                                                icon={<SafetyOutlined />}
                                            >
                                                Enable 2FA
                                            </Button>
                                        </Form>
                                    )}
                                </div>
                            </Space>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={twoFactorErrors}
                        />
                    </section>
                )}
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit().url,
        },
    ],
};
