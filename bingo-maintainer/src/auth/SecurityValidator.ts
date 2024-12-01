
import { SecurityRule, SecurityContext, SecurityEvent, SecuritySeverity } from '../types/auth';
import { logger } from '../utils/logger';

export class SecurityValidator {
  private rules: SecurityRule[] = [];

  async validateContext(context: SecurityContext): Promise<SecurityEvent[]> {
    const events: SecurityEvent[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      const matches = this.evaluateConditions(rule, context);
      if (matches) {
        events.push({
          id: crypto.randomUUID(),
          type: 'SECURITY_RULE_TRIGGERED',
          severity: rule.severity,
          timestamp: new Date(),
          source: 'SecurityValidator',
          details: `Security rule "${rule.name}" triggered`,
          metadata: {
            ruleId: rule.id,
            context,
          },
        });
      }
    }

    return events;
  }

  private evaluateConditions(rule: SecurityRule, context: SecurityContext): boolean {
    return rule.conditions.every((condition) => {
      const contextValue = context[condition.field];

      switch (condition.operator) {
        case 'eq':
          return contextValue === condition.value;
        case 'neq':
          return contextValue !== condition.value;
        case 'gt':
          return contextValue > condition.value;
        case 'lt':
          return contextValue < condition.value;
        case 'contains':
          return String(contextValue).includes(String(condition.value));
        case 'regex':
          return new RegExp(String(condition.value)).test(String(contextValue));
        default:
          return false;
      }
    });
  }
}
