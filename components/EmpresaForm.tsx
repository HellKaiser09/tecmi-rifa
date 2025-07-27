'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CAREERS } from '@/app/data/constants';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formSchema = z.object({
  nombreEmpresa: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
  ubicacion: z.string().min(2, 'La ubicación es obligatoria'),
  nombreColaborador: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cargo: z.string(),
  correo: z.string().email(),
  telefono: z.string(),
  llevaAcompanante: z.boolean().optional(),
  nombreAcompañante: z.string().optional(),
  correo2: z.string().optional(),
  telefono2: z.string().optional(),
  personasExtras: z.string().optional(),
  nivelVacante: z.string(),
  carrerasBuscadas: z.array(z.string()).min(1, 'Selecciona al menos una carrera'),
  requiereStand: z.boolean().optional(),
  stand: z.string().optional(),
  participaBolsa: z.boolean().optional(),
  traeArticulos: z.boolean().optional(),
  articulo: z.string().optional(),
  logo: z.string().optional(),
  descripcion: z.string().optional(),
  autorizacion: z.string(),
  llevaPersonasExtras: z.boolean().optional(),
  cantidadPersonasExtras: z.number().optional(),
  nombresPersonasExtras: z.array(z.string()).optional(),
});

export default function EmpresaRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreEmpresa: '',
      ubicacion: '',
      nombreColaborador: '',
      cargo: '',
      correo: '',
      telefono: '',
      llevaAcompanante: false,
      nombreAcompañante: '',
      correo2: '',
      telefono2: '',
      personasExtras: '',
      nivelVacante: '',
      carrerasBuscadas: [],
      requiereStand: false,
      stand: '',
      participaBolsa: false,
      traeArticulos: false,
      articulo: '',
      logo: '',
      descripcion: '',
      autorizacion: '',
      llevaPersonasExtras: false,
      cantidadPersonasExtras: 0,
      nombresPersonasExtras: [],
    },
  });

  const watchAcompanante = form.watch('llevaAcompanante');
  const watchStand = form.watch('requiereStand');
  const watchBolsa = form.watch('participaBolsa');
  const watchArticulos = form.watch('traeArticulos');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const carrerasTexto = values.carrerasBuscadas.join(',');

      const { error } = await supabase.from('RegistroEmpresas').insert([
        {
          ...values,
          carreraBuscada: carrerasTexto,
          tipoUsuario: 'empresa',
        },
      ]);

      if (error) throw error;

      toast.success('¡Registro exitoso!');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRemoveCareer = (careerId: string, field: any) => {
    const nuevasCarreras = field.value.filter((id: string) => id !== careerId);
    field.onChange(nuevasCarreras);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Campos principales */}
        <FormField
          control={form.control}
          name="nombreEmpresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la empresa</FormLabel>
              <FormControl>
                <Input placeholder="Mi Empresa S.A. de C.V" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ciudad, Estado, Municipio, Calle y C.P" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombreColaborador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del colaborador</FormLabel>
              <FormControl>
                <Input placeholder="Hernesto Guerrero" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Reclutador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="correo@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="555-555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ¿Llevarás acompañante? */}
        <FormField
          control={form.control}
          name="llevaAcompanante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Llevarás acompañante?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value ? "SI" : field.value === false ? "NO" : ""}
                  onChange={e => field.onChange(e.target.value === "SI")}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos de acompañante solo si llevaAcompanante es true */}
        {watchAcompanante && (
          <>
            <FormField
              control={form.control}
              name="nombreAcompañante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del acompañante</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del acompañante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correo2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo del acompañante</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono del acompañante</FormLabel>
                  <FormControl>
                    <Input placeholder="555-555-5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* ¿Llevarás personas extras? */}
        <FormField
          control={form.control}
          name="llevaPersonasExtras"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Llevarás personas extras?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value ? "SI" : field.value === false ? "NO" : ""}
                  onChange={e => field.onChange(e.target.value === "SI")}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Si lleva personas extras, pide la cantidad */}
        {form.watch('llevaPersonasExtras') && (
          <FormField
            control={form.control}
            name="cantidadPersonasExtras"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Cuántas personas adicionales asistirán?</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="0"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Genera los campos para los nombres de las personas extras */}
        {form.watch('llevaPersonasExtras') && (form.watch('cantidadPersonasExtras') ?? 0) > 0 &&
          Array.from({ length: form.watch('cantidadPersonasExtras') ?? 0 }).map((_, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={`nombresPersonasExtras.${idx}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Nombre de la persona extra #${idx + 1}`}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Nombre de la persona #${idx + 1}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))
        }

        {/* Nivel vacante */}
        <FormField
          control={form.control}
          name="nivelVacante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nivel de vacante</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Practicas(estudiantes) o Tiempo Completo(egresado)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Carreras buscadas */}
        <FormField
          control={form.control}
          name="carrerasBuscadas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carreras buscadas</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona carreras" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CAREERS.map((career) => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 space-y-2">
                {field.value.map((id) => {
                  const career = CAREERS.find((c) => c.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                    >
                      <span>{career?.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveCareer(id, field)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ¿Requiere stand? */}
        <FormField
          control={form.control}
          name="requiereStand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Requiere stand?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value ? "SI" : field.value === false ? "NO" : ""}
                  onChange={e => field.onChange(e.target.value === "SI")}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ¿Participa la empresa en la bolsa de empleo? */}
        <FormField
          control={form.control}
          name="participaBolsa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Está inscrito en la bolsa?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value ? "SI" : field.value === false ? "NO" : ""}
                  onChange={e => field.onChange(e.target.value === "SI")}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="traeArticulos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Trae artículos promocionales?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value ? "SI" : field.value === false ? "NO" : ""}
                  onChange={e => field.onChange(e.target.value === "SI")}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchArticulos && (
          <FormField
            control={form.control}
            name="articulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Qué artículos?</FormLabel>
                <FormControl>
                  <Input placeholder="Describe los artículos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Otros campos */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del logo</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción de la empresa</FormLabel>
              <FormControl>
                <Input placeholder="Breve descripción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autorizacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Autoriza el uso de sus datos?</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-black/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar empresa'}
        </Button>
      </form>
    </Form>
  );
}
