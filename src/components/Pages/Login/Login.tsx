'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startMockSession } from '@/services/SessionService';
import LoginFeedback, {
  formatRetryTime,
  type LoginFeedbackKind,
} from '@/components/Organisms/LoginFeedback/LoginFeedback';
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
 * escritorio (1366x720). Los estados de error/bloqueo son DEC-004.
 */
const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: 'onTouched',
    defaultValues: { username: '', password: '' },
  });
  const [username, password] = watch(['username', 'password']);
  const [rememberUsername, setRememberUsernameChecked] = useState(false);
  const [feedback, setFeedback] = useState<LoginFeedbackKind | null>(null);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(0);
  const requestPending = useRef(false);
  const remainingSeconds = Math.max(0, Math.ceil((retryAt - now) / 1000));

  useEffect(() => {
    if (!retryAt) return;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= retryAt) setRetryAt(0);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);

  useEffect(() => {
    const remembered = getRememberedUsername();
    if (remembered) {
      setValue('username', remembered);
      setRememberUsernameChecked(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    if (requestPending.current || Date.now() < retryAt) return;
    requestPending.current = true;
    try {
      const result = await login(data);
      if (result.success) {
        // Solo el usuario se recuerda, nunca la contrasena.
        setRememberedUsername(rememberUsername ? data.username : null);
        startMockSession(data.username);
        router.replace('/inicio');
      } else {
        setValue('password', '');
        if (result.reason === 'locked') {
          setNow(Date.now());
          setRetryAt(result.retryAt);
        }
        setFeedback(result.reason);
      }
    } catch {
      setValue('password', '');
      setFeedback('unavailable');
    } finally {
      requestPending.current = false;
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className={styles.login__title}>Iniciar sesión</h2>
          <div className={styles.login__field}>
            <InputText
              label="Usuario"
              errors={errors.username?.message}
              {...register('username', {
                required: 'El usuario es requerido',
                minLength: {
                  value: 5,
                  message: 'El campo debe tener al menos 5 caracteres',
                },
              })}
            />
          </div>
          <div className={styles.login__field}>
            <InputSecret
              label="Contraseña"
              errors={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es requerida',
              })}
            />
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
            disabled={
              isSubmitting || remainingSeconds > 0 || !username || !password
            }
          />
          {remainingSeconds > 0 && feedback !== 'locked' && (
            <p className={styles.login__forgot}>
              Podrá intentar nuevamente en {formatRetryTime(remainingSeconds)}.
            </p>
          )}
          <p className={styles.login__forgot}>
            ¿Olvidó su contraseña? Comuníquese con soporte interno.
          </p>
        </form>
      </div>
      <LoginFeedback
        onAfterClose={() => setFocus('password')}
        kind={feedback}
        remainingSeconds={remainingSeconds}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
};

export default Login;
