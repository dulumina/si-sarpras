import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form } from '@inertiajs/react';
import { App, Button, Modal, Input, Typography, Alert, Space } from 'antd';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

const { Title, Text, Paragraph } = Typography;

export default function DeleteUser() {
    const [open, setOpen] = useState(false);
    const { message } = App.useApp();

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <Title level={4} className="!text-red-600">Delete Account</Title>
                <Text type="secondary">Delete your account and all of its resources</Text>
            </div>

            <Alert
                message="Warning"
                description="Once your account is deleted, all of its resources and data will also be permanently deleted. Please proceed with caution, this cannot be undone."
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                action={
                    <Button danger type="primary" onClick={() => setOpen(true)} icon={<DeleteOutlined />}>
                        Delete Account
                    </Button>
                }
                className="rounded-xl"
            />

            <Modal
                title={
                    <Space>
                        <ExclamationCircleOutlined className="text-red-600" />
                        <span>Delete Account</span>
                    </Space>
                }
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Paragraph className="mt-4">
                    Once your account is deleted, all of its resources and data will also be permanently deleted. 
                    Please enter your password to confirm you would like to permanently delete your account.
                </Paragraph>

                <Form
                    {...ProfileController.destroy.form()}
                    onSuccess={() => {
                        setOpen(false);
                        message.success('Account deleted successfully');
                    }}
                >
                    {({ data, setData, errors, processing, resetAndClearErrors }) => (
                        <div className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <Input.Password
                                    placeholder="Enter your password to confirm"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    status={errors.password ? 'error' : ''}
                                    size="large"
                                    autoFocus
                                />
                                {errors.password && <Text type="danger" className="text-xs">{errors.password}</Text>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button onClick={() => {
                                    setOpen(false);
                                    resetAndClearErrors();
                                }}>
                                    Cancel
                                </Button>
                                <Button
                                    danger
                                    type="primary"
                                    htmlType="submit"
                                    loading={processing}
                                >
                                    Confirm Delete Account
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </Modal>
        </div>
    );
}
