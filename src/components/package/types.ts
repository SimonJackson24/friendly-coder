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

export interface PackageVersion {
  id: string;
  package_id: string;
  version: string;
  changes: string;
  package_data: Record<string, any>;
  published_by: string;
  created_at: string;
  dependency_tree: Record<string, any>;
  resolved_dependencies: Record<string, any>;
  conflict_status: Record<string, any>;
}
