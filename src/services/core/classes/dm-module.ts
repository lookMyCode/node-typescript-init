interface IDmModuleConstructorData {
  import?: DmModule[],
  export?: DmModule[],
  providers?: any[],
}

export class DmModule {
  private _import: DmModule[] = [];
  private _export: DmModule[] = [];
  private _providers: any[] = [];

  constructor(data: IDmModuleConstructorData) {
    if (data?.import) {
      this._import = data.import;
    }

    if (data?.export) {
      this._export = data.export;
    }

    if (data?.providers) {
      this._providers = data.providers;
    }

    const exps: DmModule[] = [];
    this._import.forEach(imp => {
      
      imp._providers.forEach(p => {
        this._providers.push(p);
      });
    });
  }

  export(): DmModule[] {
    return [this, ...this._export];
  }
}
