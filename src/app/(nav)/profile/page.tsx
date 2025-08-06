
import { User } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Profile</h1>
                <p className="text-muted-foreground">Manage your profile settings.</p>
            </div>
        </div>
    )
}
