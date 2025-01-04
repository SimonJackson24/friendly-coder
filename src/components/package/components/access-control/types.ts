import { PackageAccess, AccessLevel, TeamAccess, AccessRequest } from "../../types";

export interface AccessControlProps {
  packageId: string;
}

export interface UserAccessProps {
  accessList: PackageAccess[];
  newUserId: string;
  accessLevel: AccessLevel;
  onNewUserIdChange: (value: string) => void;
  onAccessLevelChange: (value: AccessLevel) => void;
  onGrantAccess: () => void;
  onRevokeAccess: (accessId: string) => void;
  onShowBulkDialog: () => void;
}

export interface BulkAccessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
  accessLevel: AccessLevel;
  onBulkAccess: () => void;
}

export interface TeamAccessProps {
  teamAccess: TeamAccess[];
  onRevokeAccess: (accessId: string) => void;
}

export interface AccessRequestsProps {
  accessRequests: AccessRequest[];
  onHandleRequest: (requestId: string, approve: boolean) => void;
}

export interface PermissionVisualizationProps {
  packageId: string;
  accessList?: PackageAccess[];
  teamAccess?: TeamAccess[];
}

export interface RoleTemplateProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplate?: string;
}