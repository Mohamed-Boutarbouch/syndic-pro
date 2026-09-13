<?php

namespace App\Http\Controllers\CoOwners;

use App\Actions\CoOwners\TransferSyndic;
use App\Http\Requests\CoOwners\TransferSyndicRequest;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TransferSyndicController
{
    public function __invoke(
        TransferSyndicRequest $request,
        Property $property,
        TransferSyndic $action,
    ): RedirectResponse {
        $toUser = User::findOrFail($request->validated('user_id'));

        $action->handle($property, $toUser);

        return back()->with('success', 'Syndic management transferred successfully.');
    }
}
