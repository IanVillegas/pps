'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, ButtonColor, Checkbox, InputText } from '@/components/Atoms';
import InputSecret from '@/sad-aml-shared/components/Atoms/InputSecret/InputSecret';
import {
  getRememberedUsername,
  login,
  setRememberedUsername,
} from '@/services/AuthService';
import LoginWave1 from '@/assets/images/LoginWave1';
import LoginWave2 from '@/assets/images/LoginWave2';
import LoginWave3 from '@/assets/images/LoginWave3';
import LogoGrupoMutual from '@/assets/images/LogoGrupoMutual';
import styles from './Login.module.scss';

interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * Login base (DEC-003). Reconstruido desde el diseno real de Figma (nodo
 * 43121:6904, via get_design_context) despues de que la primera version se
 * hizo solo con el inventario escrito: layout de dos paneles a escala de
 * escritorio (1366x720), no una tarjeta centrada generica. "Centro de
 * ayuda" es texto/enlace visual de esta pantalla; el modal real de ayuda es
 * DEC-005B. Los estados de error/bloqueo son DEC-004.
 */
const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();
  const [rememberUsername, setRememberUsernameChecked] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const remembered = getRememberedUsername();
    if (remembered) {
      setValue('username', remembered);
      setRememberUsernameChecked(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);
    if (result.success) {
      // Solo el usuario se recuerda, nunca la contrasena.
      setRememberedUsername(rememberUsername ? data.username : null);
      setSuccess(true);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__scene} aria-hidden="true">
        <div className={styles.login__bg} />
        <LoginWave1
          className={`${styles.login__wave} ${styles['login__wave--1']}`}
        />
        <LoginWave2
          className={`${styles.login__wave} ${styles['login__wave--2']}`}
        />
        <LoginWave3
          className={`${styles.login__wave} ${styles['login__wave--3']}`}
        />
      </div>

      <div className={styles.login__brand}>
        <LogoGrupoMutual className={styles.login__logo} />
        <h1 className={styles.login__heading}>
          Bienvenido a la <strong>Declaración Patrimonial</strong>
        </h1>
        <p className={styles.login__intro}>
          El sistema de Declaración Patrimonial permite registrar, actualizar y
          presentar de forma segura la información relacionada con su patrimonio
        </p>
      </div>

      <div className={styles.login__panel}>
        {success ? (
          <p role="status" className={styles.login__title}>
            {/* La redireccion real a /inicio se conecta cuando exista
                DEC-005B; hoy esa ruta no tiene pantalla. */}
            Ingreso exitoso.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className={styles.login__title}>Iniciar sesión</h2>
            <div className={styles.login__field}>
              <InputText
                label="Usuario"
                errors={errors.username?.message}
                {...register('username', { required: 'Ingrese su usuario' })}
              />
            </div>
            <div className={styles.login__field}>
              <InputSecret
                label="Contraseña"
                errors={errors.password?.message}
                {...register('password', {
                  required: 'Ingrese su contraseña',
                })}
              />
              <a href="#" className={styles.login__help}>
                Centro de ayuda
              </a>
            </div>
            <div className={styles.login__remember}>
              <Checkbox
                label="Recordar mi usuario"
                checked={rememberUsername}
                onChange={event =>
                  setRememberUsernameChecked(event.target.checked)
                }
              />
            </div>
            <Button
              text="Ingresar"
              color={ButtonColor.Cta}
              size="mediumL"
              type="submit"
              spinner={isSubmitting}
              disabled={isSubmitting}
            />
            <p className={styles.login__forgot}>
              ¿Olvidó su contraseña? Comuníquese con soporte interno.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
