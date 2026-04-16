-- Dashboard Summary View
CREATE OR REPLACE VIEW public.dashboard_summary AS
SELECT
    (SELECT count(*) FROM public.profiles) as total_staff,
    (SELECT count(*) FROM public.jobs WHERE status = 'ongoing') as active_jobs,
    (SELECT count(*) FROM public.services WHERE is_active = true) as running_services,
    (SELECT COALESCE(sum(amount), 0) FROM public.financial_transactions WHERE type = 'income' AND transaction_date >= date_trunc('month', current_date)) as monthly_income;

-- Grant access to the view
GRANT SELECT ON public.dashboard_summary TO authenticated;

-- Job Performance View
CREATE OR REPLACE VIEW public.job_performance AS
SELECT
    w.full_name as worker_name,
    count(j.id) as total_jobs,
    count(j.id) FILTER (WHERE j.status = 'completed') as completed_jobs,
    sum(j.payment_amount) FILTER (WHERE j.payment_status = 'paid') as total_earned
FROM public.workers w
LEFT JOIN public.jobs j ON w.id = j.assigned_to_worker_id
GROUP BY w.id, w.full_name;

GRANT SELECT ON public.job_performance TO authenticated;