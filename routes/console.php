<?php
// routes/console.php

use Illuminate\Support\Facades\Schedule;

Schedule::command('treinos:lembretes')->everyMinute();
