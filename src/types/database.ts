export type Plan='free'|'pro'|'premium'
export type ProjectStatus='draft'|'validating'|'building'|'branding'|'launching'|'live'|'paused'|'archived'
export type ModuleType='idea'|'market'|'product'|'brand'|'landing'|'content'|'growth'|'deploy'
export type ModuleStatus='pending'|'running'|'complete'|'failed'
export interface Database{
  public:{
    Tables:{
      profiles:{Row:{id:string;email:string;full_name:string|null;avatar_url:string|null;plan:Plan;stripe_customer_id:string|null;stripe_subscription_id:string|null;subscription_status:string|null;generations_used:number;generations_limit:number;created_at:string;updated_at:string};Insert:any;Update:any};
      projects:{Row:{id:string;user_id:string;name:string;slug:string;description:string|null;niche:string|null;status:ProjectStatus;pipeline_step:number;niche_score:number|null;market_size:string|null;competition_level:string|null;target_audience:string|null;created_at:string;updated_at:string};Insert:any;Update:any};
      project_modules:{Row:{id:string;project_id:string;module_type:ModuleType;status:ModuleStatus;output:Record<string,unknown>;tokens_used:number;created_at:string;updated_at:string};Insert:any;Update:any};
      activity_feed:{Row:{id:string;user_id:string;project_id:string|null;type:string;message:string;metadata:Record<string,unknown>;created_at:string};Insert:any;Update:any};
      usage_events:{Row:{id:string;user_id:string;event_type:string;module_type:string|null;project_id:string|null;tokens_used:number;metadata:Record<string,unknown>;created_at:string};Insert:any;Update:any};
      stripe_events:{Row:{id:string;type:string;data:any;processed_at:string};Insert:any;Update:any};
    }
  }
}
export type Profile=Database['public']['Tables']['profiles']['Row']
export type Project=Database['public']['Tables']['projects']['Row']
export type ProjectModule=Database['public']['Tables']['project_modules']['Row']
export type ActivityItem=Database['public']['Tables']['activity_feed']['Row']
export const PLAN_LIMITS:Record<Plan,{generations:number;label:string;price:string;features:string[]}>={free:{generations:7,label:'Free',price:'$0',features:['7 AI generations/mo','1 active project','Basic modules','Community support']},pro:{generations:50,label:'Pro',price:'$29/mo',features:['50 AI generations/mo','10 projects','All AI modules','Priority support']},premium:{generations:200,label:'Premium',price:'$79/mo',features:['200 AI generations/mo','Unlimited projects','All modules','White-label']}}
