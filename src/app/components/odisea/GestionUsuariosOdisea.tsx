import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users,
    Key,
    UserPlus,
    Edit,
    Trash2,
    Shield,
    Mail,
    Phone,
    CheckCircle2,
    X,
    Eye,
    EyeOff,
    Search,
    ShieldAlert,
    RefreshCw,
    UserCheck,
    UserX,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

import type { UserRecord } from '../../types/usuario';
import { getDefaultUsers, saveDefaultUsers } from '../../../services/usuariosService';
import { AlertTriangle } from 'lucide-react';

export function GestionUsuariosOdisea() {
    const [usuarios, setUsuarios] = useState<UserRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState<string>('Todos');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modals visibility states
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Selected user for editing/password assignment
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    // Add / Edit form states
    const [formNombre, setFormNombre] = useState('');
    const [formRol, setFormRol] = useState<'Administrador' | 'Agricultor' | 'Líder de Campo' | 'Catador' | 'Tostador'>('Agricultor');
    const [formEmail, setFormEmail] = useState('');
    const [formCelular, setFormCelular] = useState('');

    // Password reset states
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Load users from localStorage
    useEffect(() => {
        setIsLoading(true);
        getDefaultUsers()
            .then((data) => {
                setUsuarios(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Error al cargar usuarios');
                setIsLoading(false);
            });
    }, []);

    const saveUsuariosToDb = async (updated: UserRecord[]) => {
        setUsuarios(updated);
        try {
            await saveDefaultUsers(updated);
        } catch (err) {
            toast.error('Error al guardar usuarios');
        }
    };

    // Filtered users list
    const filteredUsuarios = useMemo(() => {
        return usuarios.filter(u => {
            const matchesSearch = 
                u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.celular.includes(searchTerm);
            const matchesRol = filterRol === 'Todos' || u.rol === filterRol;
            return matchesSearch && matchesRol;
        });
    }, [usuarios, searchTerm, filterRol]);

    // Statistics counts
    const stats = useMemo(() => {
        const total = usuarios.length;
        const habilitados = usuarios.filter(u => u.estado === 'Habilitado').length;
        const deshabilitados = total - habilitados;
        return { total, habilitados, deshabilitados };
    }, [usuarios]);

    // Open add new user modal
    const handleOpenAdd = () => {
        setSelectedUser(null);
        setFormNombre('');
        setFormRol('Agricultor');
        setFormEmail('');
        setFormCelular('');
        setIsAddEditOpen(true);
    };

    // Open edit user modal
    const handleOpenEdit = (user: UserRecord) => {
        setSelectedUser(user);
        setFormNombre(user.nombre);
        setFormRol(user.rol);
        setFormEmail(user.email);
        setFormCelular(user.celular);
        setIsAddEditOpen(true);
    };

    // Save added or edited user
    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNombre || !formEmail) {
            toast.error('Complete los campos obligatorios');
            return;
        }

        if (selectedUser) {
            // Edit Mode
            const updated = usuarios.map(u => 
                u.id === selectedUser.id 
                    ? { ...u, nombre: formNombre, rol: formRol, email: formEmail, celular: formCelular }
                    : u
            );
            saveUsuariosToDb(updated);
            toast.success('Perfil de usuario actualizado');
        } else {
            // Add Mode
            const newUsr: UserRecord = {
                id: `usr-${Date.now()}`,
                nombre: formNombre,
                rol: formRol,
                email: formEmail,
                celular: formCelular,
                estado: 'Habilitado',
                ultimoAcceso: 'Nunca'
            };
            saveUsuariosToDb([newUsr, ...usuarios]);
            toast.success('Usuario registrado con éxito');
        }
        setIsAddEditOpen(false);
    };

    // Toggle Enable / Disable status
    const handleToggleStatus = (userId: string) => {
        const updated = usuarios.map(u => {
            if (u.id === userId) {
                const newState = u.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
                toast.success(`Usuario ${newState === 'Habilitado' ? 'Habilitado' : 'Deshabilitado'}`, {
                    description: `El acceso para ${u.nombre} ha sido configurado.`
                });
                return { ...u, estado: newState as any };
            }
            return u;
        });
        saveUsuariosToDb(updated);
    };

    // Delete user
    const handleDeleteUser = (userId: string) => {
        const user = usuarios.find(u => u.id === userId);
        if (user?.rol === 'Administrador' && usuarios.filter(u => u.rol === 'Administrador').length <= 1) {
            toast.error('No se puede eliminar el único administrador del sistema');
            return;
        }
        if (confirm(`¿Está seguro de eliminar a ${user?.nombre}?`)) {
            const updated = usuarios.filter(u => u.id !== userId);
            saveUsuariosToDb(updated);
            toast.success('Usuario removido del sistema');
        }
    };

    // Open change password modal
    const handleOpenPassword = (user: UserRecord) => {
        setSelectedUser(user);
        setNewPassword('');
        setShowPassword(false);
        setIsPasswordOpen(true);
    };

    // Generate random secure password
    const handleGeneratePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(pass);
        toast.info('Contraseña segura generada');
    };

    // Save password reset
    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        // Simular guardado de contraseña encriptada
        toast.success('Nueva contraseña asignada', {
            description: `Se han configurado las nuevas credenciales para ${selectedUser?.nombre}.`
        });
        setIsPasswordOpen(false);
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 text-left font-sans">
            {/* Header & Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Users className="text-blue-600" size={40} /> Consola de Seguridad y Usuarios
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                        Gestión Integral de Privilegios, Contraseñas y Acceso a la Red
                    </p>
                </div>
                
                <Button 
                    onClick={handleOpenAdd}
                    className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-lg shadow-blue-500/10 cursor-pointer self-start md:self-center shrink-0 border-none"
                >
                    <UserPlus size={16} /> Crear Nuevo Usuario
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Usuarios en el Sistema', value: stats.total, icon: Users, color: 'text-slate-700 bg-slate-50 border-slate-200' },
                    { label: 'Cuentas Activas', value: stats.habilitados, icon: UserCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                    { label: 'Cuentas Inhabilitadas', value: stats.deshabilitados, icon: UserX, color: 'text-rose-700 bg-rose-50 border-rose-100' },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className={cn("p-6 rounded-[32px] border flex items-center gap-6 shadow-xs", stat.color)}>
                            <div className="h-14 w-14 rounded-2xl bg-white/60 flex items-center justify-center shadow-xs shrink-0">
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider opacity-60 leading-none mb-1.5">{stat.label}</p>
                                <p className="text-3xl font-sans font-black leading-none">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-[32px] border border-slate-200/60 shadow-xs flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={18} />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, email o celular..."
                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-semibold text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Label className="text-[10px] font-black uppercase text-slate-400 block ml-2">Filtrar Rol:</Label>
                    <select
                        value={filterRol}
                        onChange={(e) => setFilterRol(e.target.value)}
                        className="h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 font-black text-xs text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="Todos">Todos los Roles</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Agricultor">Agricultor</option>
                        <option value="Líder de Campo">Líder de Campo</option>
                        <option value="Catador">Catador</option>
                        <option value="Tostador">Tostador</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200/60 rounded-[48px] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Datos de Contacto</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Último Acceso</th>
                                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse border-b border-slate-100">
                                        <td colSpan={6} className="py-6 px-8">
                                            <div className="h-6 bg-slate-100 rounded w-1/3"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-rose-500 font-bold">
                                        <AlertTriangle className="inline mr-2" size={16} /> {error}
                                    </td>
                                </tr>
                            ) : filteredUsuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                                        No se encontraron usuarios en esta categoría.
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredUsuarios.map((usr) => (
                                <tr key={usr.id} className="border-b border-slate-55/10 hover:bg-slate-50/50 transition-all duration-300">
                                    {/* Name */}
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                {usr.nombre.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{usr.nombre}</p>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {usr.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rol */}
                                    <td className="py-5 px-8">
                                        <Badge className={cn(
                                            "border-none text-[9px] font-black uppercase px-2.5 py-1 rounded-md",
                                            usr.rol === 'Administrador' && "bg-rose-50 text-rose-700",
                                            usr.rol === 'Agricultor' && "bg-emerald-50 text-emerald-700",
                                            usr.rol === 'Líder de Campo' && "bg-blue-50 text-blue-700",
                                            usr.rol === 'Catador' && "bg-amber-50 text-amber-700",
                                            usr.rol === 'Tostador' && "bg-purple-50 text-purple-700"
                                        )}>
                                            {usr.rol}
                                        </Badge>
                                    </td>

                                    {/* Contact */}
                                    <td className="py-5 px-8 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <Mail size={12} className="text-slate-400" />
                                            <span>{usr.email}</span>
                                        </div>
                                        {usr.celular && (
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone size={12} className="text-slate-400" />
                                                <span>{usr.celular}</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="py-5 px-8 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(usr.id)}
                                            className="border-none bg-transparent cursor-pointer hover:scale-105 transition-all"
                                        >
                                            <Badge className={cn(
                                                "border-none text-[9px] font-black uppercase px-3 py-1.5 rounded-full cursor-pointer",
                                                usr.estado === 'Habilitado' 
                                                    ? "bg-emerald-500 text-white shadow-xs" 
                                                    : "bg-rose-500 text-white shadow-xs"
                                            )}>
                                                {usr.estado}
                                            </Badge>
                                        </button>
                                    </td>

                                    {/* Last Access */}
                                    <td className="py-5 px-8 text-xs font-bold text-slate-500">
                                        {usr.ultimoAcceso}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Reset Password */}
                                            <Button
                                                onClick={() => handleOpenPassword(usr)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                                                title="Asignar Contraseña"
                                            >
                                                <Key size={16} />
                                            </Button>

                                            {/* Edit Profile */}
                                            <Button
                                                onClick={() => handleOpenEdit(usr)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                                                title="Editar Perfil"
                                            >
                                                <Edit size={16} />
                                            </Button>

                                            {/* Delete */}
                                            <Button
                                                onClick={() => handleDeleteUser(usr.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                                                title="Eliminar Usuario"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: Add or Edit User */}
            <AnimatePresence>
                {isAddEditOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddEditOpen(false)}
                            className="fixed inset-0 bg-black"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 space-y-6"
                        >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-sans font-black text-slate-800 flex items-center gap-3">
                                    <Shield size={22} className="text-blue-600" />
                                    {selectedUser ? 'Editar Cuenta de Usuario' : 'Registrar Nuevo Usuario'}
                                </h3>
                                <button onClick={() => setIsAddEditOpen(false)} className="h-8 w-8 rounded-full bg-slate-50 border-none text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveUser} className="space-y-5">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Nombre Completo *</Label>
                                    <Input
                                        required
                                        value={formNombre}
                                        onChange={e => setFormNombre(e.target.value)}
                                        placeholder="Nombre del usuario..."
                                        className="h-12 rounded-xl border-slate-200"
                                    />
                                </div>

                                {/* Rol */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Rol Operativo *</Label>
                                    <select
                                        value={formRol}
                                        onChange={e => setFormRol(e.target.value as any)}
                                        className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                    >
                                        <option value="Administrador">Administrador (Mesa de Control)</option>
                                        <option value="Agricultor">Agricultor (Finca/Cosechas)</option>
                                        <option value="Líder de Campo">Líder de Campo (JAC Veredal)</option>
                                        <option value="Catador">Catador (Q-Grader / Calidad)</option>
                                        <option value="Tostador">Tostador / Cliente Internacional</option>
                                    </select>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Correo Electrónico *</Label>
                                    <Input
                                        required
                                        type="email"
                                        value={formEmail}
                                        onChange={e => setFormEmail(e.target.value)}
                                        placeholder="correo@odisea.co..."
                                        className="h-12 rounded-xl border-slate-200"
                                    />
                                </div>

                                {/* Celular */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Celular / Teléfono</Label>
                                    <Input
                                        value={formCelular}
                                        onChange={e => setFormCelular(e.target.value)}
                                        placeholder="+57 300 000 0000..."
                                        className="h-12 rounded-xl border-slate-200"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <Button type="button" onClick={() => setIsAddEditOpen(false)} variant="outline" className="h-12 px-6 rounded-xl text-slate-500 font-bold border-slate-200">Cancelar</Button>
                                    <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                                        {selectedUser ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 2: Change Password */}
            <AnimatePresence>
                {isPasswordOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPasswordOpen(false)}
                            className="fixed inset-0 bg-black"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 max-w-lg w-full relative z-10 space-y-6"
                        >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-sans font-black text-slate-800 flex items-center gap-3">
                                    <Key size={22} className="text-blue-600" />
                                    Asignar Contraseña
                                </h3>
                                <button onClick={() => setIsPasswordOpen(false)} className="h-8 w-8 rounded-full bg-slate-50 border-none text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-left">
                                <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-blue-950 uppercase leading-none">Control de Privilegios</p>
                                    <p className="text-[11px] text-blue-700 leading-normal font-semibold">
                                        Usted está asignando credenciales directamente para **{selectedUser.nombre}**. Asegúrese de comunicárselas a través de un canal seguro.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSavePassword} className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Nueva Contraseña de Acceso *</Label>
                                        <button 
                                            type="button" 
                                            onClick={handleGeneratePassword}
                                            className="text-[10px] font-black text-blue-600 hover:underline border-none bg-transparent cursor-pointer"
                                        >
                                            Generar Clave Segura
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres..."
                                            className="h-12 pr-12 rounded-xl border-slate-200 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-350 hover:text-slate-700 border-none bg-transparent cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <Button type="button" onClick={() => setIsPasswordOpen(false)} variant="outline" className="h-12 px-6 rounded-xl text-slate-500 font-bold border-slate-200">Cancelar</Button>
                                    <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer">
                                        Guardar Contraseña
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
