import type { InitOptions, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import globalEn from '@/sad-aml-shared/translations/en/global.json';
import globalEs from '@/sad-aml-shared/translations/es/global.json';
import type { I18nType } from '../types/internationalization.type';
import i18next from 'i18next';

export const i18nGlobalConfig = {
  lng: 'es',
  resources: {
    es: {
      global: globalEs,
    },
    en: {
      global: globalEn,
    },
  },
  ns: ['global'],
  defaultNS: 'global',
};

interface BuilderI18nConfig extends InitOptions {
  resources?: Resource;
}

interface I18nBuilderOptions<I18nType, BuilderType> {
  withConfig(i18nConfig: BuilderI18nConfig): BuilderType;
  build(): I18nType;
}

export class I18nBuilder implements I18nBuilderOptions<I18nType, I18nBuilder> {
  private instance: I18nType;
  private config: BuilderI18nConfig = {};

  constructor() {
    this.instance = i18next.createInstance();
    this.instance.use(initReactI18next);

    this.config = {
      interpolation: { escapeValue: false },
      lng: 'es',
      resources: {},
      ns: ['global'],
      defaultNS: 'global',
    };
  }

  /**
   * Set config for the builder
   * @param i18nConfig
   */
  withConfig(i18nConfig: BuilderI18nConfig): I18nBuilder {
    this.config = {
      ...this.config,
      ...i18nConfig,
      resources: this.mergeResources(
        this.config.resources,
        i18nConfig.resources
      ),
      ns: [...new Set([...(this.config.ns || []), ...(i18nConfig.ns || [])])],
    };
    return this;
  }

  /**
   * Combines resources from the default resources and incoming resources
   * @param currentResources
   * @param incomingResources
   */
  private mergeResources(
    currentResources?: Record<string, any>,
    incomingResources?: Record<string, any>
  ) {
    return Object.entries(incomingResources ?? {}).reduce(
      (config, [lng, content]: [string, Record<string, any>]) => {
        config[lng] = {
          ...config[lng],
          ...content,
        };
        return config;
      },
      {
        ...currentResources,
      }
    );
  }

  build(): I18nType {
    this.instance.init(this.config);
    return this.instance;
  }
}

export const i18nDefaultInstance = new I18nBuilder()
  .withConfig(i18nGlobalConfig)
  .build();
