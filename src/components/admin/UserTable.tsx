import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserData {
  id: string;
  email: string;
  plan_type: string;
  status: string;
  api_access: boolean;
}

interface UserTableProps {
  users: UserData[];
  onToggleApiAccess: (userId: string, currentAccess: boolean) => void;
  onToggleStatus: (userId: string, currentStatus: string) => void;
}

const UserTable = ({ users, onToggleApiAccess, onToggleStatus }: UserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">Plan</TableHead>
          <TableHead className="text-white">Statut</TableHead>
          <TableHead className="text-white">Accès API</TableHead>
          <TableHead className="text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="text-white">{user.email}</TableCell>
            <TableCell className="text-white">{user.plan_type}</TableCell>
            <TableCell className="text-white">{user.status}</TableCell>
            <TableCell>
              <Switch
                checked={user.api_access}
                onCheckedChange={() => onToggleApiAccess(user.id, user.api_access)}
              />
            </TableCell>
            <TableCell>
              <Button
                variant={user.status === 'active' ? 'destructive' : 'default'}
                onClick={() => onToggleStatus(user.id, user.status)}
                size="sm"
              >
                {user.status === 'active' ? 'Désactiver' : 'Activer'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;