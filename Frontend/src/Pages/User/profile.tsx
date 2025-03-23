"use client"

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader2, User, MapPin, Package, Lock } from "lucide-react";
import { toast } from "sonner"

export default function ProfilePage(){
    const user = {}; 
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
            },
        },
    });

    const passwordForm = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset(user);
        }
    }, [user, form]);

    async function onSubmit(data: any) {
        // try {
        //     const res = await updateProfile(data).unwrap();
        //     if (res.success) {
        //         toast({ title: "Profile Updated Successfully" });
        //         setIsEditing(false);
        //         form.reset(res.user);
        //     } else {
        //         toast({
        //             title: "Update Failed",
        //             description: res.message,
        //             variant: "destructive",
        //         });
        //     }
        // } catch (error) {
        //     toast({
        //         title: "Update Failed",
        //         description: error?.data?.message || "An unexpected error occurred.",
        //         variant: "destructive",
        //     });
        // }
    }

    async function onPasswordSubmit(data: any) {
        // if (data.newPassword !== data.confirmNewPassword) {
        //     toast("Passwords do not match", {
        //         description: "Please ensure the new passwords are identical.",
        //         variant: "destructive",
        //     });
        //     return;
        // }
        try {
            // const res = await updatePassword(data).unwrap();
            // if (res.success) {
            //     toast({ title: "Password Updated Successfully" });
            //     passwordForm.reset();
            // } else {
            //     toast({
            //         title: "Password Update Failed",
            //         description: res.message,
            //         variant: "destructive",
            //     });
            // }
            // toast({ title: "Password Updated Successfully" });
            // passwordForm.reset();
        } catch (error) {
            // toast({
            //     title: "Password Update Failed",
            //     description: error?.data?.message || "An unexpected error occurred.",
            //     variant: "destructive",
            // });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "destructive" : "outline"}
                    >
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                </div>

                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="personal" className="space-x-2">
                            <User size={16} />
                            <span>Personal Info</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="space-x-2">
                            <Lock size={16} />
                            <span>Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="items" className="space-x-2">
                            <Package size={16} />
                            <span>Your Items</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <User size={20} />
                                            <span>Personal Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="tel" disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <MapPin size={20} />
                                            <span>Address Details</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="address.street"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Street Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address.state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address.postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {isEditing && (
                                    <Button
                                        type="submit"
                                        className="w-full"
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="security">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock size={20} />
                                            <span>Update Password</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={passwordForm.control}
                                            name="oldPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Old Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                <Button type="submit" className="w-full">
                                    Update Password
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="items">
                        {/* Items content goes here */}
                        {/* {isFetchingItems ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin text-gray-600" size={40} />
                            </div>
                        ) : (
                            <Items items={items} onDeleteItem={handleDeleteItem} refetch={refetch} />
                        )} */}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
