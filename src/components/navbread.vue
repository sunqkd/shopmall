<template>
    <div class="nav-breadcrumb-wrap">
        <div class="container">
            <nav class="nav-breadcrumb">
                <a href="/">Home</a>
                <!-- <span>Goods</span> -->
                <slot name="a"></slot>
                <slot name="b"></slot>
            </nav>
        </div>
    </div>
</template>
<script>
    export default {
        
    }
</script>
