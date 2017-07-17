<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5;

use Illuminate\Console\Command;

class PackageHandler extends \Zhiyi\Plus\Support\PackageHandler
{
    /**
     * Publish asstes to public.
     *
     * @param \Illuminate\Console\Command $command [description]
     * @return mixed
     * @author Seven Du <shiweidu@outlook.com>
     */
    public function publishHandle(Command $command)
    {
        if (! $command->confirm('Are you sure to publish')) {
            return;
        }

        $this->unlink();
        $command->call('vendor:publish', [
            '--provider' => ServiceProvider::class,
            '--tag' => 'public',
            '--force' => true,
        ]);
    }


    /**
     * Create a soft link to public.
     *
     * @param \Illuminate\Console\Command $command
     * @return mixed
     * @author Seven Du <shiweidu@outlook.com>
     */
    public function linkHandle(Command $command)
    {
        if (! $command->confirm('Use a soft link to publish assets')) {
            return;
        }

        $this->unlink();
        $files = app('files');
        
        foreach ($this->getPaths() as $target => $link) {
            $parentDir = dirname($link);
            if (! $files->isDirectory($parentDir)) {
                $files->makeDirectory($parentDir);
            }

            $files->link($target, $link);
            $command->line(sprintf('<info>Created Link</info> <comment>[%s]</comment> <info>To</info> <comment>[%s]</comment>', $target, $link));
        }

        $command->info('Linking complete.');
    }

    /**
     * Delete links.
     *
     * @return void
     * @author Seven Du <shiweidu@outlook.com>
     */
    protected function unlink()
    {
        $files = app('files');
        foreach ($this->getPaths() as $path) {
            if (! $files->delete($path)) {
                $files->deleteDirectory($path, false);
            }
        }
    }

    /**
     * Get the Publish path,
     *
     * @return array
     * @author Seven Du <shiweidu@outlook.com>
     */
    protected function getPaths(): array
    {
        return ServiceProvider::pathsToPublish(ServiceProvider::class, 'public');
    }
}
