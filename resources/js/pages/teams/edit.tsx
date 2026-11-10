import { UserAddOutlined, MailOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Head, router, useForm } from '@inertiajs/react';
import { App, Button, Form as AntdForm, Input, Typography, Avatar, List, Tag, Dropdown, Tooltip, Space, Alert, Switch } from 'antd';
import { useMemo, useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import DeleteTeamModal from '@/components/delete-team-modal';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import { useInitials } from '@/hooks/use-initials';
import { edit, index, update } from '@/routes/teams';
import { update as updateMember } from '@/routes/teams/members';
import { update as updateScopes } from '@/routes/teams/scopes';
import type {
    RoleOption,
    Team,
    TeamInvitation,
    TeamMember,
    TeamPermissions,
    TeamScope,
} from '@/types';

const { Title, Text } = Typography;

type Props = {
    team: Team;
    members: TeamMember[];
    invitations: TeamInvitation[];
    scopes: TeamScope[];
    permissions: TeamPermissions;
    availableRoles: RoleOption[];
};

export default function TeamEdit({
    team,
    members,
    invitations,
    scopes: initialScopes,
    permissions,
    availableRoles,
}: Props) {
    const getInitials = useInitials();
    const { message } = App.useApp();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
    const [cancelInvitationDialogOpen, setCancelInvitationDialogOpen] = useState(false);
    const [invitationToCancel, setInvitationToCancel] = useState<TeamInvitation | null>(null);

    const { data, setData, patch, processing, errors } = useForm({
        name: team.name,
    });

    const [scopes, setScopes] = useState<TeamScope[]>(initialScopes);

    const pageTitle = useMemo(
        () => permissions.canUpdateTeam ? `Edit ${team.name}` : `View ${team.name}`,
        [permissions.canUpdateTeam, team.name],
    );

    const handleUpdateTeam = () => {
        patch(update(team.slug).url, {
            preserveScroll: true,
            onSuccess: () => message.success('Team updated successfully'),
        });
    };

    const updateMemberRole = (member: TeamMember, newRole: string) => {
        router.patch(updateMember([team.slug, member.id]).url, {
            role: newRole,
        }, {
            preserveScroll: true,
            onSuccess: () => message.success('Member role updated'),
        });
    };

    const toggleScope = (scopeKey: string, isActive: boolean) => {
        const updated = scopes.map((s) =>
            s.scope === scopeKey ? { ...s, is_active: isActive } : s,
        );

        setScopes(updated);

        router.put(updateScopes(team.slug).url, {
            scopes: updated.map((s) => ({
                scope: s.scope,
                label: s.label,
                is_active: s.is_active,
            })),
        }, {
            preserveScroll: true,
            onSuccess: () => message.success('Data scope updated'),
            onError: () => {
                setScopes(scopes);
                message.error('Failed to update data scope');
            },
        });
    };

    const confirmRemoveMember = (member: TeamMember) => {
        setMemberToRemove(member);
        setRemoveMemberDialogOpen(true);
    };

    const confirmCancelInvitation = (invitation: TeamInvitation) => {
        setInvitationToCancel(invitation);
        setCancelInvitationDialogOpen(true);
    };

    return (
        <>
            <Head title={pageTitle} />

            <div className="space-y-12">
                <section>
                    <div className="mb-6">
                        <Title level={4}>Team Settings</Title>
                        <Text type="secondary">Update your team name and settings</Text>
                    </div>

                    {permissions.canUpdateTeam ? (
                        <AntdForm layout="vertical" onFinish={handleUpdateTeam} requiredMark="optional">
                            <AntdForm.Item
                                label="Team Name"
                                required
                                validateStatus={errors.name ? 'error' : ''}
                                help={errors.name}
                            >
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    size="large"
                                    placeholder="Enter team name"
                                />
                            </AntdForm.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                icon={<EditOutlined />}
                            >
                                Save Changes
                            </Button>
                        </AntdForm>
                    ) : (
                        <Title level={5}>{team.name}</Title>
                    )}
                </section>

                <section className="pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Title level={4}>Team Members</Title>
                            <Text type="secondary">
                                {permissions.canCreateInvitation ? 'Manage who belongs to this team' : 'View team members'}
                            </Text>
                        </div>

                        {permissions.canCreateInvitation && (
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={() => setInviteDialogOpen(true)}
                            >
                                Invite Member
                            </Button>
                        )}
                    </div>

                    <List
                        itemLayout="horizontal"
                        dataSource={members}
                        renderItem={(member) => (
                            <List.Item
                                actions={[
                                    member.role !== 'owner' && permissions.canUpdateMember ? (
                                        <Dropdown
                                            menu={{
                                                items: availableRoles.map((role) => ({
                                                    key: role.value,
                                                    label: role.label,
                                                    onClick: () => updateMemberRole(member, role.value),
                                                })),
                                            }}
                                            trigger={['click']}
                                            key="role"
                                        >
                                            <Button size="small">
                                                <Space>
                                                    {member.role_label}
                                                    <DownOutlined className="text-[10px]" />
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    ) : (
                                        <Tag key="role" className="rounded-full">{member.role_label}</Tag>
                                    ),
                                    member.role !== 'owner' && permissions.canRemoveMember ? (
                                        <Tooltip title="Remove member" key="remove">
                                            <Button
                                                danger
                                                type="text"
                                                icon={<CloseOutlined />}
                                                onClick={() => confirmRemoveMember(member)}
                                            />
                                        </Tooltip>
                                    ) : null
                                ]}
                                className="bg-white p-5 rounded-xl mb-3 border border-gray-100 shadow-sm"
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar size="large" src={member.avatar}>
                                            {getInitials(member.name)}
                                        </Avatar>
                                    }
                                    title={<Text strong>{member.name}</Text>}
                                    description={<Text type="secondary">{member.email}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </section>

                {invitations.length > 0 && (
                    <section className="pt-8 border-t border-gray-100">
                        <div className="mb-6">
                            <Title level={4}>Pending Invitations</Title>
                            <Text type="secondary">Invitations that haven't been accepted yet</Text>
                        </div>

                        <List
                            itemLayout="horizontal"
                            dataSource={invitations}
                            renderItem={(invitation) => (
                                <List.Item
                                    actions={[
                                        permissions.canCancelInvitation && (
                                            <Tooltip title="Cancel invitation" key="cancel">
                                                <Button
                                                    danger
                                                    type="text"
                                                icon={<CloseOutlined />}
                                                onClick={() => confirmCancelInvitation(invitation)}
                                                />
                                            </Tooltip>
                                        )
                                    ]}
                                    className="bg-white p-5 rounded-xl mb-3 border border-gray-100 shadow-sm"
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar icon={<MailOutlined />} className="bg-gray-100 text-gray-500" />
                                        }
                                        title={<Text strong>{invitation.email}</Text>}
                                        description={<Tag color="blue" className="rounded-full">{invitation.role_label}</Tag>}
                                    />
                                </List.Item>
                            )}
                        />
                    </section>
                )}

                {scopes.length > 0 && (
                    <section className="pt-8 border-t border-gray-100">
                        <div className="mb-6">
                            <Title level={4}>Data Scopes</Title>
                            <Text type="secondary">
                                Toggle data scoping for each module. When enabled, data is automatically filtered by the current team.
                            </Text>
                        </div>

                        <List
                            dataSource={scopes}
                            renderItem={(scope) => (
                                <List.Item
                                    actions={[
                                        <Switch
                                            key="toggle"
                                            checked={scope.is_active}
                                            onChange={(checked) => toggleScope(scope.scope, checked)}
                                            checkedChildren={<CheckOutlined />}
                                            unCheckedChildren={<CloseOutlined />}
                                        />,
                                    ]}
                                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                                >
                                    <List.Item.Meta
                                        title={<Text strong>{scope.label}</Text>}
                                        description={
                                            <Text type="secondary">
                                                {scope.is_active ? 'Scoped by team' : 'Shared across all teams'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </section>
                )}

                {permissions.canDeleteTeam && !team.isPersonal && (
                    <section className="pt-8 border-t border-gray-100">
                        <div className="mb-6">
                            <Title level={4} className="!text-red-600">Danger Zone</Title>
                            <Text type="secondary">Permanently delete your team</Text>
                        </div>

                        <Alert
                            message="Proceed with caution"
                            description="Once you delete a team, there is no going back. Please be certain."
                            type="error"
                            showIcon
                            icon={<ExclamationCircleOutlined />}
                            action={
                                <Button danger type="primary" onClick={() => setDeleteDialogOpen(true)}>
                                    Delete Team
                                </Button>
                            }
                            className="rounded-xl"
                        />
                    </section>
                )}
            </div>

            {permissions.canCreateInvitation && (
                <InviteMemberModal
                    team={team}
                    availableRoles={availableRoles}
                    open={inviteDialogOpen}
                    onOpenChange={setInviteDialogOpen}
                />
            )}

            <RemoveMemberModal
                team={team}
                member={memberToRemove}
                open={removeMemberDialogOpen}
                onOpenChange={setRemoveMemberDialogOpen}
            />

            <CancelInvitationModal
                team={team}
                invitation={invitationToCancel}
                open={cancelInvitationDialogOpen}
                onOpenChange={setCancelInvitationDialogOpen}
            />

            {permissions.canDeleteTeam && !team.isPersonal && (
                <DeleteTeamModal
                    team={team}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                />
            )}
        </>
    );
}

TeamEdit.layout = (props: { team: { name: string; slug: string } }) => ({
    breadcrumbs: [
        {
            title: 'Teams',
            href: index().url,
        },
        {
            title: props.team.name,
            href: edit(props.team.slug).url,
        },
    ],
});
