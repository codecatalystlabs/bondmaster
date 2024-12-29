"use client";

import * as React from "react";
import { Plus, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserInfo, UserResponseInfo } from "@/types/user";
import useSWR, { mutate } from "swr";
import { createUser, editUser, fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import { Loader } from "../ui/loader";
import toast, { Toaster } from "react-hot-toast";

const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email.",
	}),
	surname: z.string().min(1, {
		message: "Surname is required.",
	}),
	firstname: z.string().min(1, {
		message: "Firstname is required.",
	}),
	gender: z.enum(["Male", "Female", "Other"]),
	title: z.string().optional(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
	company_id: z.number().optional(),
});

export function UserManagement() {
	const [users, setUsers] = React.useState<UserInfo[]>([]);
	const [user, setUser] = React.useState<UserInfo | null>(null);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [editingUser, setEditingUser] =
		React.useState<UserResponseInfo | null>(null);
	const [showPassword, setShowPassword] = React.useState<{
		[key: string]: boolean;
	}>({});
	const [showModalPassword, setShowModalPassword] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			surname: "",
			firstname: "",
			gender: "Male" as "Male" | "Female" | "Other",
			title: "",
			password: "",
			company_id: 0,
		},
	});

	React.useEffect(() => {
		if (editingUser) {
			form.reset({
				username: editingUser.username,
				email: editingUser.email,
				surname: editingUser.surname,
				firstname: editingUser.firstname,
				gender: editingUser.gender as "Male" | "Female" | "Other",
				title: editingUser.title,
				password: editingUser.password,
				company_id: 1,
			});
		} else {
			form.reset({
				username: "",
				email: "",
				surname: "",
				firstname: "",
				gender: "Male",
				title: "",
				password: "",
				company_id: 1,
			});
		}
		setShowModalPassword(false);
	}, [editingUser, form]);

	console.log(editingUser, "editingUser");

	const {
		data: usersData,
		error,
		isLoading,
	} = useSWR(`${BASE_URL}/users`, fetcher);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const userPayload: UserInfo = {
			...values,
			company_id: 1,
			title: values.title || "",
			created_by: "admin",
			updated_by: "admin",
		};

		try {
			if (editingUser) {
				// Edit existing user
				const response = await editUser({
					url: `${BASE_URL}/user/${editingUser.ID}`,
					userInfo: userPayload,
				});

				mutate(`${BASE_URL}/users`);
				if (response.data) {
					toast.success("User updated successfully");
				}
			} else {
				// Create new user
				const response = await createUser({
					url: `${BASE_URL}/user`,
					userInfo: userPayload,
				});

				mutate(`${BASE_URL}/users`);
				if (response.data) {
					toast.success("User created successfully");
				}
			}

			setIsDialogOpen(false);
			setEditingUser(null);
			form.reset();
		} catch (error: any) {
			toast.error(error?.message || "An error occurred");
			console.error("Error submitting form:", error);
		}
	}

	const toggleUserStatus = (userId: string) => {
		// setUsers(users.map(user =>
		//   user.id === userId ? { ...user, isActive: !user.isActive } : user
		// ))
	};

	const deleteUser = (userId: string) => {
		console.log(userId);
		// setUsers(users.filter(user => user.id !== userId))
	};

	const togglePasswordVisibility = (userId: string) => {
		setShowPassword((prev) => ({ ...prev, [userId]: !prev[userId] }));
	};

	return (
		<div className="space-y-4">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">
							User Management
						</h2>
						<Dialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						>
							<DialogTrigger asChild>
								<Button
									onClick={() =>
										setEditingUser(null)
									}
								>
									<Plus className="mr-2 h-4 w-4" />{" "}
									Add User
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[700px]">
								<DialogHeader>
									<DialogTitle>
										{editingUser
											? "Edit User"
											: "Add New User"}
									</DialogTitle>
									<DialogDescription>
										{editingUser
											? "Edit user account details."
											: "Create a new user account."}{" "}
										Click save when you're done.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(
											onSubmit
										)}
										className="flex flex-row space-x-4 w-full"
									>
										<div className="flex-1 space-y-4">
											<FormField
												control={
													form.control
												}
												name="username"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Username
														</FormLabel>
														<FormControl>
															<Input
																placeholder="roland"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="email"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Email
														</FormLabel>
														<FormControl>
															<Input
																placeholder="roland@example.com"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="surname"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Surname
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Doe"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="firstname"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Firstname
														</FormLabel>
														<FormControl>
															<Input
																placeholder="John"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="flex-1 space-y-4">
											<FormField
												control={
													form.control
												}
												name="gender"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Gender
														</FormLabel>
														<Select
															onValueChange={
																field.onChange
															}
															defaultValue={
																field.value
															}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select gender" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="Male">
																	Male
																</SelectItem>
																<SelectItem value="Female">
																	Female
																</SelectItem>
																<SelectItem value="Other">
																	Other
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="title"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Title
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Mr."
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="password"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Password
														</FormLabel>
														<FormControl>
															<div className="flex items-center space-x-2">
																<Input
																	type={
																		showModalPassword
																			? "text"
																			: "password"
																	}
																	{...field}
																/>
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		setShowModalPassword(
																			!showModalPassword
																		)
																	}
																>
																	{showModalPassword ? (
																		<EyeOff className="h-4 w-4" />
																	) : (
																		<Eye className="h-4 w-4" />
																	)}
																</Button>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="company_id"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Company
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Company ID"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</form>
								</Form>
								<DialogFooter>
									<Button
										type="submit"
										onClick={form.handleSubmit(
											onSubmit
										)}
									>
										Save
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Full Name</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Company</TableHead>
								{/* <TableHead>Status</TableHead> */}
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{usersData?.data.map(
								(user: UserResponseInfo) => (
									<TableRow key={user.username}>
										<TableCell>
											{user.username}
										</TableCell>
										<TableCell>
											{user.email}
										</TableCell>
										<TableCell>
											{`${user.title || ""} ${
												user.firstname
											} ${
												user.surname
											}`.trim()}
										</TableCell>
										<TableCell>
											{user.gender}
										</TableCell>
										<TableCell>
											{user.company.name ||
												"N/A"}
										</TableCell>
										{/* <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell> */}
										<TableCell>
											<div className="flex items-center space-x-2">
												<Switch
													checked={true}
													onCheckedChange={() =>
														console.log(
															"toggle"
														)
													}
												/>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => {
														setEditingUser(
															user
														);
														setIsDialogOpen(
															true
														);
													}}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<AlertDialog>
													<AlertDialogTrigger
														asChild
													>
														<Button
															variant="ghost"
															size="icon"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Are
																you
																absolutely
																sure?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This
																action
																cannot
																be
																undone.
																This
																will
																permanently
																delete
																the
																user
																account
																and
																remove
																their
																data
																from
																our
																servers.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>
																Cancel
															</AlertDialogCancel>
															<AlertDialogAction
																onClick={() =>
																	console.log(
																		"deleted"
																	)
																}
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</>
			)}
		</div>
	);
}
