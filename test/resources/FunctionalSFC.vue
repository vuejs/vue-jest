<template functional>
    <div @click="props.onClick(props.msg.id)">
      {{props.msg.title}}
      <slot></slot>
    </div>
</template>
