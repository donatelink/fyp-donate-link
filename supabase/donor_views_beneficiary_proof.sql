-- DonateLink — let donors see the beneficiary payout linked to their donation
-- Run this in the Supabase SQL Editor AFTER beneficiaries.sql.
-- Closes the loop: donor -> NGO -> beneficiary, so the donor can view the
-- NGO's transfer/delivery proof for the beneficiary their donation funded.

-- A donor can read the beneficiary_request row linked to one of their donations
-- (via donations.beneficiary_request_id, set when the NGO advances to Transferred).
create policy "donor views requests linked to their donations"
  on public.beneficiary_requests
  for select using (
    exists (
      select 1 from public.donations d
      where d.beneficiary_request_id = beneficiary_requests.id
        and d.donor_id = auth.uid()
    )
  );

-- ...and the per-stage proof updates for that linked request.
create policy "donor views updates of linked requests"
  on public.beneficiary_request_updates
  for select using (
    exists (
      select 1 from public.beneficiary_requests br
      join public.donations d on d.beneficiary_request_id = br.id
      where br.id = beneficiary_request_updates.request_id
        and d.donor_id = auth.uid()
    )
  );
