
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestAuth() {
    const { signUp } = useAuth();
    const [touristEmail, setTouristEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateUser = async (email: string) => {
        if (!email) {
            toast.error("Please enter an email");
            return;
        }
        setLoading(true);
        try {
            const { error } = await signUp(email, "TestPass123!", "Test Tourist");
            if (error) {
                toast.error(error.message);
            } else {
                toast.success(`Confirmation email sent to ${email}. Check your inbox!`);
            }
        } catch (e) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Hackathon User Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">


                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Create Tourist</h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder="tourist@example.com"
                                value={touristEmail}
                                onChange={(e) => setTouristEmail(e.target.value)}
                            />
                            <Button
                                onClick={() => handleCreateUser(touristEmail)}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Tourist"}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 bg-muted p-4 rounded-md">
                        <h4 className="font-semibold mb-2">Checklist:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Check your email inbox for confirmation link</li>
                            <li>Verify "Role-specific badge" in email</li>
                            <li>Verify CTA button works</li>
                            <li>After clicking verify, check Supabase Dashboard &gt; Auth &gt; Users</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
